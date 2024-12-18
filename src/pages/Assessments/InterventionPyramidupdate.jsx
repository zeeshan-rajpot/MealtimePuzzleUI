import React, { useState, useEffect, useCallback } from "react";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { debounce } from "lodash";


import { baseUrl } from "../../features/config";

const InterventionPyramidupdate = () => {
  const { urn, session, childName } = useParams();
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageLabel, setCurrentImageLabel] = useState("");
  const [imageData, setImageData] = useState({});
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [childHistory, setChildHistory] = useState("");
  const [imageDataCounter, setImageDataCounter] = useState(0);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isAdditionalInfoModalOpen, setIsAdditionalInfoModalOpen] =
    useState(false);
    const [isRecommendationModalOpen, setIsRecommendationModalOpen] = useState(false);
  const [reportRecommendation, setReportRecommendation] = useState("");
  const [recommendationError, setRecommendationError] = useState(false);
const [additionalInfo, setAdditionalInfo] = useState({
  parents: "",
  referrer: "",
  gp: "",
  privateProvider: "",
});

// Separate states for suggestions and loading for each field
const [suggestions, setSuggestions] = useState({
  parents: [],
  referrer: [],
  gp: [],
  privateProvider: []
});
const [isLoading, setIsLoading] = useState({
  parents: false,
  referrer: false,
  gp: false,
  privateProvider: false
});

  const [modalData, setModalData] = useState({
    clinicalPrompt: "",
    priority: "",
    formulation: "",
    recommendation: "",
  });
  const [interventionData, setInterventionData] = useState(null);

  useEffect(() => {
    const fetchInterventionData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${baseUrl}/get/intervention/${urn}/${session}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setInterventionData(response.data);

        setChildHistory(response.data.childHistory || "");

        const existingEntries = response.data.sessionEntries || [];
        setImageDataCounter(existingEntries.length);

        // Optionally, set selectedImages based on existing entries
        const existingLabels = existingEntries.map((entry) => entry.domainname);
        setSelectedImages(existingLabels);
      } catch (err) {
        console.error("Error fetching intervention data:", err);
        toast.error("Failed to load intervention data");
      }
    };

    fetchInterventionData();
  }, [urn, session]);

  const fetchAddressSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]); // Clear suggestions if less than 3 characters
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/address-autocomplete`, { query });
      console.log("API response:", response.data); // Debugging log
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleImageClick = (id, label) => {
    setCurrentImageLabel(label); // Set the label instead of ID
    console.log(label); // Console the label text

    const entry = interventionData?.sessionEntries?.find((entry) => {
      console.log("Entry object:", entry); // Log the entire entry object
      console.log("Domain Name:", entry.domainname); // Log the domainname of each entry
      return entry.domainname === label; // Ensure case-insensitive comparison
    });

    if (entry) {
      setModalData({
        clinicalPrompt: entry.clinicalPrompt,
        priority: entry.priority,
        formulation: entry.formulation,
        recommendation: entry.recommendation,
      });
    } else {
      setModalData({
        clinicalPrompt: "",
        priority: "",
        formulation: "",
        recommendation: "",
      });
    }

    setIsModalOpen(true);
  };
  const debouncedFetch = useCallback(
    debounce(async (query, field) => {
      if (query.length < 3) {
        setSuggestions((prev) => ({ ...prev, [field]: [] }));
        return;
      }

      setIsLoading((prev) => ({ ...prev, [field]: true }));
      try {
        const response = await axios.post(`${baseUrl}/address-autocomplete`, { query });
        setSuggestions((prev) => ({
          ...prev,
          [field]: response.data.suggestions.slice(0, 5) || []
        }));
      } catch (error) {
        console.error(`Error fetching suggestions for ${field}:`, error);
      } finally {
        setIsLoading((prev) => ({ ...prev, [field]: false }));
      }
    }, 300),
    []
  );

  const handleModalSave = () => {
    if (
      !modalData.priority
    ) {
      toast.error("priority field required");
      return;
    }

    const updatedEntries = interventionData.sessionEntries.map((entry) =>
      entry.domainname === currentImageLabel
        ? { ...entry, ...modalData }
        : entry
    );

    const isNewData = !interventionData.sessionEntries.find(
      (entry) => entry.domainname === currentImageLabel
    );

    if (isNewData) {
      updatedEntries.push({ domainname: currentImageLabel, ...modalData });
      setImageDataCounter((prevCount) => prevCount + 1);
    }

    setInterventionData((prev) => ({
      ...prev,
      sessionEntries: updatedEntries,
    }));

    setSelectedImages((prev) =>
      prev.includes(currentImageLabel) ? prev : [...prev, currentImageLabel]
    );

    setIsModalOpen(false);
  };

  const handleNextClick = () => {
    setIsHistoryModalOpen(true); // Open the modal to enter child history
  };

  const handleHistorySubmit = async () => {
    try {
      const domains = selectedImages.map((label) => {
        // console.log("label", label);

        const entry = interventionData.sessionEntries.find(
          (entry) => entry.domainname === label
        );
        return {
          domainName: entry?.domainname || label,
          clinicalPrompt: entry?.clinicalPrompt || "",
          priority: entry?.priority || "",
          formulation: entry?.formulation || "",
          recommendation: entry?.recommendation || "",
        };
      });

      const payload = {
        childHistory: childHistory || "",
        domains,
      };

      console.log("Payload being sent:", payload);

      // Fetch token from local storage (or wherever it's stored)
      const token = localStorage.getItem("token"); // Replace with your token retrieval method

      // Make API call using axios
      const response = await axios.put(
        `http://localhost:5001/api/update/Intervention/${urn}/${session}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json", // Ensure JSON content type
            Authorization: `Bearer ${token}`, // Add token to Authorization header
          },
        }
      );

      console.log("Intervention added successfully:", response.data);

      // Store session
      localStorage.setItem("session", response.data.session);

      // Show success message
      toast.success("Assesment update successfully!");
      navigate(-1);
      // Navigate to detail page
      // navigate(`/home/detailpage/${urn}/${session}`);
    } catch (err) {
      console.error("Failed to add intervention:", err);
      toast.error("Failed to add intervention");
    } 
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getImageOpacity = (label) => {
    // Find the entry for the current image label
    const entry = interventionData?.sessionEntries?.find(
      (entry) => entry.domainname === label
    );

    // If the entry exists and has valid data, set opacity to 1, otherwise 0.5
    return entry &&
      (entry.clinicalPrompt ||
        entry.priority ||
        entry.recommendation ||
        entry.formulation)
      ? 1
      : 0.3;
  };

  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([{ username: "", role: "" }]);
  const [newMember, setNewMember] = useState({ username: "", role: "" });
  const [showInputs, setShowInputs] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/users");
        console.log(response.data)
        setUsers((prevUsers) => [...response.data, ...prevUsers.filter(user => user.isNew)]);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddMember = () => {
    if (newMember.username && newMember.role) {
      const memberWithFlag = { ...newMember, isNew: true };
      setMembers([...members, memberWithFlag]);
      setUsers([...users, memberWithFlag]);
      setNewMember({ username: "", role: "" });
    } else {
      console.error("Please fill both fields");
    }
  };

  const handleAddDropdown = () => {
    setMembers([...members, { username: "", role: "", isNew: true }]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedMembers = [...members];
    if (field === "username") {
      const selectedUser = users.find(user => `${user.firstName} ${user.lastName}` === value);
      updatedMembers[index].username = value;
      updatedMembers[index].role = selectedUser ? selectedUser.role : "";
    } else {
      updatedMembers[index][field] = value;
    }
    setMembers(updatedMembers);
    localStorage.setItem("accessors", JSON.stringify(updatedMembers));
  };

  const handleNewMemberChange = (field, value) => {
    setNewMember((prev) => ({ ...prev, [field]: value }));
  };

  const handleAssessmentNext = () => {
    setIsAssessmentModalOpen(false);
    setIsAdditionalInfoModalOpen(true);
  };


 // Handles input change and fetches suggestions
 const handleAdditionalInfoChange = (field, value) => {
  setAdditionalInfo((prev) => ({
    ...prev,
    [field]: value,
  }));
  debouncedFetch(value, field);
};

// Applies the suggestion to the input field
const applySuggestion = (field, suggestion) => {
  setAdditionalInfo((prev) => ({
    ...prev,
    [field]: suggestion,
  }));
  setSuggestions((prev) => ({ ...prev, [field]: [] })); // Clear suggestions after selection
};


const handleSaveAdditionalInfo = () => {
  // Save additional info to local storage or handle it as per your logic
  localStorage.setItem("additionalInfo", JSON.stringify(additionalInfo));
  setIsAdditionalInfoModalOpen(false); // Close modal after saving
  navigate(`/home/detailpage/${urn}/${session}`);
};


  return (
    <>
      <Header />
      <section className="w-full flex gap-4">
        <SideBar />
        <div className="w-full">
          <div className="flex justify-between items-center">
            <div className="flex mt-4" onClick={handleBack}>
              <img src="/ion_chevron-back.svg" alt="back_arrow" />
              <button className="text-base">Back</button>
            </div>
            <div className="text-base font-semibold mr-12">
              <br />
              {`Domains added: ${imageDataCounter}/ 17`}
            </div>
          </div>

          <div className="flex justify-center items-center flex-col my-10 ">
            <h1 className="text-2xl font-bold mb-4">{childName}</h1>
            <h1 className="text-2xl font-semibold">Select The Domain</h1>
            <div
              data-label="Variety & Volume"
              onClick={() => handleImageClick(1, "Variety & Volume")}
              className="mt-8"
              style={{ opacity: getImageOpacity("Variety & Volume") }}
            >
              <img src="/VarietyandVolume.svg" alt="food" />
            </div>

            <div
              data-label="New Food Learning"
              onClick={() => handleImageClick(2, "New Food Learning")}
              style={{ opacity: getImageOpacity("New Food Learning") }}
            >
              <img src="/NewFoodLearning.svg" alt="food" />
            </div>

            <div
              data-label="Food Mapping"
              onClick={() => handleImageClick(3, "Food Mapping")}
              style={{ opacity: getImageOpacity("Food Mapping") }}
            >
              <img src="/FoodMapping.svg" alt="food" />
            </div>

            <div className="flex">
              <div
                data-label="Sensory"
                onClick={() => handleImageClick(4, "Sensory")}
                style={{ opacity: getImageOpacity("Sensory") }}
              >
                <img src="/Sensory.svg" alt="food" />
              </div>

              <div
                data-label="Oral Motor"
                onClick={() => handleImageClick(5, "Oral Motor")}
                style={{ opacity: getImageOpacity("Oral Motor") }}
              >
                <img src="/OralMotor.svg" alt="food" />
              </div>
            </div>
            <div className="flex">
              <div
                data-label="Self Feeding"
                onClick={() => handleImageClick(6, "Self Feeding")}
                style={{ opacity: getImageOpacity("Self Feeding") }}
              >
                <img src="/SelfFeeding.svg" alt="food" />
              </div>
              <div
                data-label="Mealtime Engagement"
                onClick={() => handleImageClick(7, "Mealtime Engagement")}
                style={{ opacity: getImageOpacity("Mealtime Engagement") }}
              >
                <img src="/MealtimeEngagement.svg" alt="food" />
              </div>
            </div>
            <div className="flex mt-4">
              <div
                data-label="Food Exposure"
                onClick={() => handleImageClick(8, "Food Exposure")}
                style={{ opacity: getImageOpacity("Food Exposure") }}
              >
                <img src="/FoodExposure.svg" alt="food" />
              </div>
              <div
                data-label="Mealtime Environment"
                onClick={() => handleImageClick(9, "Mealtime Environment")}
                style={{ opacity: getImageOpacity("Mealtime Environment") }}
              >
                <img src="/MealtimeEnvironment.svg" alt="food" />
              </div>
              <div
                data-label="Flexibility"
                onClick={() => handleImageClick(10, "Flexibility")}
                style={{ opacity: getImageOpacity("Flexibility") }}
              >
                <img src="/Flexibility.svg" alt="food" />
              </div>
            </div>
            <div className="flex">
              <div
                data-label="Hunger Cycle"
                onClick={() => handleImageClick(11, "Hunger Cycle")}
                style={{ opacity: getImageOpacity("Hunger Cycle") }}
              >
                <img src="/HungerCycle.svg" alt="food" />
              </div>
              <div
                data-label="Mealtime Roles"
                onClick={() => handleImageClick(12, "Mealtime Roles")}
                style={{ opacity: getImageOpacity("Mealtime Roles") }}
              >
                <img src="/MealtimeRoles.svg" alt="food" />
              </div>
              <div
                data-label="Caregivers Influence"
                onClick={() => handleImageClick(13, "Caregivers Influence")}
                style={{ opacity: getImageOpacity("Caregivers Influence") }}
              >
                <img src="/CaregiversInfluence.svg" alt="food" />
              </div>
              <div
                data-label="Calm Mealtimes"
                onClick={() => handleImageClick(14, "Calm Mealtimes")}
                style={{ opacity: getImageOpacity("Calm Mealtimes") }}
              >
                <img src="/CalmMealtime.svg" alt="food" />
              </div>
            </div>
            <div className="flex">
              <div
                data-label="Development"
                onClick={() => handleImageClick(15, "Development")}
                style={{ opacity: getImageOpacity("Development") }}
              >
                <img src="/Development.svg" alt="food" />
              </div>
              <div
                data-label="Medical / Nutrition"
                onClick={() => handleImageClick(16, "Medical or Nutrition")}
                style={{ opacity: getImageOpacity("Medical or Nutrition") }}
              >
                <img src="/MedicalNutrition.svg" alt="food" />
              </div>
              <div
                data-label="Temperament"
                onClick={() => handleImageClick(17, "Temperament")}
                style={{ opacity: getImageOpacity("Temperament") }}
              >
                <img src="/Temperament.svg" alt="food" />
              </div>
            </div>

            <button
              className="mt-8 w-[30%] rounded-full px-4 py-2 bg-custom-gradient text-white"
              onClick={handleHistorySubmit}
            >
              Update
            </button>
          </div>
        </div>
      </section>
      
      {isModalOpen && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
    <div className="modal-container w-11/12 max-w-7xl p-12 rounded-lg bg-white shadow-lg transition-transform duration-300 transform translate-y-4">
    <div className="text-left text-2xl font-semibold mb-4">
  {childName && <span>Child Name: {childName}</span>}
</div>

      <div className="text-center text-3xl font-semibold mb-8">
        {currentImageLabel ? `Edit ${currentImageLabel}` : "Add Domain"}
      </div>

      <div className="input-container flex flex-col my-6 relative w-full">
        <textarea
          value={modalData.clinicalPrompt}
          onChange={(e) =>
            setModalData((prev) => ({
              ...prev,
              clinicalPrompt: e.target.value,
            }))
          }
          placeholder=" "
          className="border-2 py-5 px-4 rounded-md w-full text-lg h-48 resize-none"
          required
        />
        <label className={`absolute left-4 top-3 text-gray-500 text-base transition-all duration-200
          ${modalData.clinicalPrompt ? 'text-xs top-1 -translate-y-1' : 'top-6'}`}>
          Clinical Prompt
        </label>
      </div>

      <div className="input-container flex flex-col my-6 relative w-full">
        <textarea
          value={modalData.formulation}
          onChange={(e) =>
            setModalData((prev) => ({
              ...prev,
              formulation: e.target.value,
            }))
          }
          placeholder=" "
          className="border-2 py-5 px-4 rounded-md w-full text-lg h-48 resize-none"
        />
        <label className={`absolute left-4 top-3 text-gray-500 text-base transition-all duration-200
          ${modalData.formulation ? 'text-xs top-1 -translate-y-1' : 'top-6'}`}>
          Formulation
        </label>
      </div>

      <div className="input-container flex flex-col my-6 relative w-full">
        <textarea
          value={modalData.recommendation}
          onChange={(e) =>
            setModalData((prev) => ({
              ...prev,
              recommendation: e.target.value,
            }))
          }
          placeholder=" "
          className="border-2 py-5 px-4 rounded-md w-full text-lg h-48 resize-none"
        />
        <label className={`absolute left-4 top-3 text-gray-500 text-base transition-all duration-200
          ${modalData.recommendation ? 'text-xs top-1 -translate-y-1' : 'top-6'}`}>
          Recommendation
        </label>
      </div>

      <div className="input-container flex flex-col my-6 relative w-full">
        <select
          value={modalData.priority}
          onChange={(e) =>
            setModalData((prev) => ({
              ...prev,
              priority: e.target.value,
            }))
          }
          className="border-2 py-4 px-4 rounded-md bg-white appearance-none text-lg w-full"
        >
          <option value="" disabled hidden>
            Select Priority
          </option>
          <option value="high">High</option>
          <option value="moderate">Moderate</option>
          <option value="low">Low</option>
        </select>
        <label className="absolute left-4 top-3 text-gray-500 text-base transition-all duration-200 text-xs">
          Priority
        </label>
      </div>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="bg-red-500 text-white px-10 py-3 rounded-full mr-4 text-lg"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleModalSave}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-10 py-3 rounded-full text-lg"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}






{isAssessmentModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-[90%] md:w-[60%]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Who has done this assessment?</h2>
              {/* <button
                onClick={() => setShowInputs(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Add Member
              </button> */}

            </div>
            {/* {showInputs && (
              <>
                <div className="flex flex-col my-4">
                  <label className="pb-1 font-medium">Name</label>
                  <input
                    className="border-2 border-gray-300 py-2 px-3 rounded-md w-full focus:outline-none focus:border-blue-500"
                    type="text"
                    placeholder="Enter name"
                    value={newMember.username}
                    onChange={(e) => handleNewMemberChange("username", e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col my-4">
                  <label className="pb-1 font-medium">Role</label>
                  <input
                    className="border-2 border-gray-300 py-2 px-3 rounded-md w-full focus:outline-none focus:border-blue-500"
                    type="text"
                    placeholder="Enter role"
                    value={newMember.role}

                  />
                </div>
                <div className="flex justify-center space-x-4">

                  <button
                    onClick={() => setShowInputs(false)}
                    className="bg-red-500 text-white px-8 py-2 rounded-full hover:bg-red-600 transition"
                  >
                    Close
                  </button>

                  <button
                    className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-2 rounded-full hover:from-blue-600 hover:to-green-600 transition"
                    onClick={handleAddMember}
                  >
                    Save
                  </button>
                </div>
              </>
            )} */}
            {members.map((member, index) => (
              <div key={index} className="flex space-x-4 items-center my-4">
                <div className="flex flex-col w-1/2">
                  <label className="pb-1 font-medium">Select Name</label>
                  <select
                    className="border-2 border-gray-300 py-2 px-3 rounded-md w-full focus:outline-none focus:border-blue-500"
                    onChange={(e) => handleInputChange(index, "username", e.target.value)}
                    value={member.username}
                  >
                    <option value="">Select Name</option>
                    {users.map((user, idx) => (
                      <option key={idx} value={`${user.firstName} ${user.lastName}`}>
                        {user.firstName} {user.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col w-1/2">
                  <label className="pb-1 font-medium">Role</label>
                  <input
                    className="border-2 border-gray-300 py-2 px-3 rounded-md w-full focus:outline-none focus:border-blue-500"
                    type="text"
                    value={member.role}
                    readOnly
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-center mt-4">
              <button
                onClick={handleAddDropdown}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                + Add Another Dropdown
              </button>
            </div>
            <div className="mt-8 flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => setIsAssessmentModalOpen(false)}
                className="bg-red-500 text-white px-8 py-2 rounded-full hover:bg-red-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAssessmentNext}
                className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-2 rounded-full hover:from-blue-600 hover:to-green-600 transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

{/* Additional Information Modal */}
{isAdditionalInfoModalOpen && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
    <div className="bg-white p-8 rounded-lg w-[60%]">
      <h2 className="text-center mb-6 text-2xl font-semibold">
        Additional Information
      </h2>

      {/* Parents Address Field with Suggestions */}
      <div className="flex flex-col my-4">
        <label className="pb-1 font-medium">Parents [Address]</label>
        <input
          className="border-2 border-gray-300 py-2 px-3 rounded-md w-full"
          type="text"
          placeholder="Parents' Address"
          value={additionalInfo.parents}
          onChange={(e) => handleAdditionalInfoChange("parents", e.target.value)}
        />
        {isLoading.parents && <p>Loading suggestions...</p>}
        {suggestions.parents.length > 0 && (
          <ul className="border border-gray-300 mt-2 rounded-md">
            {suggestions.parents.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => applySuggestion("parents", suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Referrer Address Field with Suggestions */}
      <div className="flex flex-col my-4">
        <label className="pb-1 font-medium">Referrer [Address]</label>
        <input
          className="border-2 border-gray-300 py-2 px-3 rounded-md w-full"
          type="text"
          placeholder="Referrer's Address"
          value={additionalInfo.referrer}
          onChange={(e) => handleAdditionalInfoChange("referrer", e.target.value)}
        />
        {isLoading.referrer && <p>Loading suggestions...</p>}
        {suggestions.referrer.length > 0 && (
          <ul className="border border-gray-300 mt-2 rounded-md">
            {suggestions.referrer.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => applySuggestion("referrer", suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* GP Address Field with Suggestions */}
      <div className="flex flex-col my-4">
        <label className="pb-1 font-medium">GP [Address]</label>
        <input
          className="border-2 border-gray-300 py-2 px-3 rounded-md w-full"
          type="text"
          placeholder="GP's Address"
          value={additionalInfo.gp}
          onChange={(e) => handleAdditionalInfoChange("gp", e.target.value)}
        />
        {isLoading.gp && <p>Loading suggestions...</p>}
        {suggestions.gp.length > 0 && (
          <ul className="border border-gray-300 mt-2 rounded-md">
            {suggestions.gp.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => applySuggestion("gp", suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Private Provider Address Field with Suggestions */}
      <div className="flex flex-col my-4">
        <label className="pb-1 font-medium">Private Provider [Address]</label>
        <input
          className="border-2 border-gray-300 py-2 px-3 rounded-md w-full"
          type="text"
          placeholder="Private Provider's Address"
          value={additionalInfo.privateProvider}
          onChange={(e) => handleAdditionalInfoChange("privateProvider", e.target.value)}
        />
        {isLoading.privateProvider && <p>Loading suggestions...</p>}
        {suggestions.privateProvider.length > 0 && (
          <ul className="border border-gray-300 mt-2 rounded-md">
            {suggestions.privateProvider.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => applySuggestion("privateProvider", suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Uniting Care Checkbox */}
      <div className="flex items-center my-4">
        <input
          type="checkbox"
          id="unitingCareCheckbox"
          className="mr-2"
          checked={additionalInfo.unitingCare || false}
          onChange={(e) =>
            setAdditionalInfo((prev) => ({
              ...prev,
              unitingCare: e.target.checked,
            }))
          }
        />
        <label htmlFor="unitingCareCheckbox" className="font-medium">
          Uniting Care
        </label>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => setIsAdditionalInfoModalOpen(false)}
          className="bg-red-500 text-white px-8 py-2 rounded-full mr-2"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveAdditionalInfo}
          className="bg-green-500 text-white px-8 py-2 rounded-full"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default InterventionPyramidupdate;
