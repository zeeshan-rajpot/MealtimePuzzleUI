import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import { useAddInterventionMutation } from "../../features/Forms/Intervention";
import axios from "axios";
import { toast } from "react-hot-toast";

const Pyramid = () => {
  const { register, handleSubmit, setValue, reset } = useForm();
  const { urn, childName } = useParams();
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageLabel, setCurrentImageLabel] = useState("");
  const [session, setSession] = useState("");
  const [imageId, setImageId] = useState(null);
  const [imageData, setImageData] = useState({});
  const [imageDataCounter, setImageDataCounter] = useState(0);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [childHistory, setChildHistory] = useState("");
  const [childHistoryError, setChildHistoryError] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isAdditionalInfoModalOpen, setIsAdditionalInfoModalOpen] =
    useState(false);
  const [isRecommendationModalOpen, setIsRecommendationModalOpen] =
    useState(false);
  const [reportRecommendation, setReportRecommendation] = useState("");
  const [recommendationError, setRecommendationError] = useState(false);

  const [addIntervention, { isLoading, isError, error }] =
    useAddInterventionMutation();

  const handleBack = () => {
    navigate(-1);
  };

  const handleImageClick = (imageId, label) => {
    let updatedSelectedImages;

    if (selectedImages.includes(imageId)) {
      updatedSelectedImages = selectedImages.filter((id) => id !== imageId);
      setIsModalOpen(false);
    } else {
      updatedSelectedImages = [...selectedImages, imageId];
      setCurrentImageLabel(label);
      setIsModalOpen(true);
    }

    setSelectedImages(updatedSelectedImages);
    setImageId(imageId);
  };

  useEffect(() => {
    if (imageId) {
      const imageDataForCurrentImage = imageData[imageId] || {};
      setValue("clinicalPrompt", imageDataForCurrentImage.clinicalPrompt || "");
      setValue("priority", imageDataForCurrentImage.priority || "");
      setValue("formulation", imageDataForCurrentImage.formulation || "");
      setValue("recommendation", imageDataForCurrentImage.recommendation || "");
    }
  }, [imageId, setValue, imageData]);

  const handleNextClick = () => {
    if (selectedImages.length === 0) {
      alert("Select at least one category");
    } else {
      setIsHistoryModalOpen(true);
    }
  };

  const handleHistorySubmit = async () => {
    if (!childHistory.trim()) {
      setChildHistoryError(true);
      return;
    } else {
      setChildHistoryError(false);
    }
    setIsHistoryModalOpen(false); // Close history modal
    setIsRecommendationModalOpen(true); // Open recommendation modal
  };

  const handleRecommendationSubmit = async () => {
    try {
      const domains = selectedImages
        .map((imageId) => ({
          domainName: imageData[imageId]?.label || "",
          clinicalPrompt: imageData[imageId]?.clinicalPrompt || "",
          priority: imageData[imageId]?.priority || "",
          formulation: imageData[imageId]?.formulation || "",
          recommendation: imageData[imageId]?.recommendation || "",
        }))
        .filter((domain) => domain.domainName); // Filters out any empty domain entries

      if (!domains.length) {
        toast.error("Please select at least one domain.");
        return;
      }

      const {
        data: { session, childData },
      } = await axios.post(
        "http://localhost:5001/api/post/Intervention",
        { childUrn: urn, childHistory, reportRecommendation, domains },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      localStorage.setItem("session", session);
      setSession(session);
      toast.success("Assessment added successfully!");
      console.log(childData);
      navigate(`/intervention`);
      // Navigate only if childData is available
    } catch (err) {
      console.error("Failed to add Assessment:", err);
      toast.error("Failed to add Assessment");
    }
  };

  const onClose = () => {
    setIsModalOpen(false);
  };

  const onSubmit = (data) => {
    const updatedImageData = {
      ...imageData,
      [imageId]: {
        ...data,
        label: currentImageLabel, // Store label for API
      },
    };
    setImageData(updatedImageData);
    setImageDataCounter(Object.keys(updatedImageData).length);
    setIsModalOpen(false);
  };

  const getImageOpacity = (imageId) => {
    // If the image has data, opacity should be 1, otherwise 0.5
    return imageData[imageId] ? 1 : 0.3;
  };

  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([{ username: "", role: "" }]);
  const [newMember, setNewMember] = useState({ username: "", role: "" });
  const [showInputs, setShowInputs] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/users");
        console.log(response.data);
        setUsers((prevUsers) => [
          ...response.data,
          ...prevUsers.filter((user) => user.isNew),
        ]);
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
      const selectedUser = users.find(
        (user) => `${user.firstName} ${user.lastName}` === value
      );
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

  const [additionalInfo, setAdditionalInfo] = useState({
    parents: "",
    referrer: "",
    gp: "",
    privateProvider: "",
  });

  const handleAdditionalInfoChange = (field, value) => {
    setAdditionalInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const [addressSuggestions, setAddressSuggestions] = useState([]);

  // Function to fetch addresses from RapidAPI
  const fetchAddressSuggestions = async (query) => {
    if (!query) return;

    try {
      const response = await axios.get("https://addressr.p.rapidapi.com/", {
        params: { query }, // Assuming 'query' is the parameter for the address
        headers: {
          "x-rapidapi-host": "addressr.p.rapidapi.com",
          "x-rapidapi-key":
            "7df33f1d15msha1c808d44e12e03p1c2b9cjsn3113ce343810", // Your RapidAPI key
        },
      });

      // Assuming the API response contains a list of suggested addresses
      setAddressSuggestions(response.data.addresses || []);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  };

  const handleAddressChange = (type, value) => {
    handleAdditionalInfoChange(type, value);
    fetchAddressSuggestions(value); // Fetch suggestions when input changes
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
              {`  Domains added: ${imageDataCounter}/ 17`}
            </div>
          </div>

          <div className="flex justify-center items-center flex-col my-10 ">
            <h1 className="text-2xl font-bold mb-3">{childName}</h1>
            <h1 className="text-2xl font-semibold">Select The Domain</h1>
            <div
              data-label="Variety & Volume"
              onClick={() => handleImageClick(1, "Variety & Volume")}
              style={{ opacity: getImageOpacity(1) }}
              className="mt-8"
            >
              <img src="/VarietyandVolume.svg" alt="food" />
            </div>

            <div
              data-label="New Food Learning"
              onClick={() => handleImageClick(2, "New Food Learning")}
              style={{ opacity: getImageOpacity(2) }}
            >
              <img src="/NewFoodLearning.svg" alt="food" />
            </div>

            <div
              data-label="Food Mapping"
              onClick={() => handleImageClick(3, "Food Mapping")}
              style={{ opacity: getImageOpacity(3) }}
            >
              <img src="/FoodMapping.svg" alt="food" />
            </div>

            <div className="flex">
              <div
                data-label="Sensory"
                onClick={() => handleImageClick(4, "Sensory")}
                style={{ opacity: getImageOpacity(4) }}
              >
                <img src="/Sensory.svg" alt="food" />
              </div>

              <div
                data-label="Oral Motor"
                onClick={() => handleImageClick(5, "Oral Motor")}
                style={{ opacity: getImageOpacity(5) }}
              >
                <img src="/OralMotor.svg" alt="food" />
              </div>
            </div>
            <div className="flex">
              <div
                data-label="Self Feeding"
                onClick={() => handleImageClick(6, "Self Feeding")}
                style={{ opacity: getImageOpacity(6) }}
              >
                <img src="/SelfFeeding.svg" alt="food" />
              </div>
              <div
                data-label="Mealtime Engagement"
                onClick={() => handleImageClick(7, "Mealtime Engagement")}
                style={{ opacity: getImageOpacity(7) }}
              >
                <img src="/MealtimeEngagement.svg" alt="food" />
              </div>
            </div>
            <div className="flex mt-4">
              <div
                data-label="Food Exposure"
                onClick={() => handleImageClick(8, "Food Exposure")}
                style={{ opacity: getImageOpacity(8) }}
              >
                <img src="/FoodExposure.svg" alt="food" />
              </div>
              <div
                data-label="Mealtime Environment"
                onClick={() => handleImageClick(9, "Mealtime Environment")}
                style={{ opacity: getImageOpacity(9) }}
              >
                <img src="/MealtimeEnvironment.svg" alt="food" />
              </div>
              <div
                data-label="Flexibility"
                onClick={() => handleImageClick(10, "Flexibility")}
                style={{ opacity: getImageOpacity(10) }}
              >
                <img src="/Flexibility.svg" alt="food" />
              </div>
            </div>
            <div className="flex">
              <div
                data-label="Hunger Cycle"
                onClick={() => handleImageClick(11, "Hunger Cycle")}
                style={{ opacity: getImageOpacity(11) }}
              >
                <img src="/HungerCycle.svg" alt="food" />
              </div>
              <div
                data-label="Mealtime Roles"
                onClick={() => handleImageClick(12, "Mealtime Roles")}
                style={{ opacity: getImageOpacity(12) }}
              >
                <img src="/MealtimeRoles.svg" alt="food" />
              </div>
              <div
                data-label="Caregivers Influence"
                onClick={() => handleImageClick(13, "Caregivers Influence")}
                style={{ opacity: getImageOpacity(13) }}
              >
                <img src="/CaregiversInfluence.svg" alt="food" />
              </div>
              <div
                data-label="Calm Mealtimes"
                onClick={() => handleImageClick(14, "Calm Mealtimes")}
                style={{ opacity: getImageOpacity(14) }}
              >
                <img src="/CalmMealtime.svg" alt="food" />
              </div>
            </div>
            <div className="flex">
              <div
                data-label="Development"
                onClick={() => handleImageClick(15, "Development")}
                style={{ opacity: getImageOpacity(15) }}
              >
                <img src="/Development.svg" alt="food" />
              </div>
              <div
                data-label="Medical / Nutrition"
                onClick={() => handleImageClick(16, "Medical / Nutrition")}
                style={{ opacity: getImageOpacity(16) }}
              >
                <img src="/MedicalNutrition.svg" alt="food" />
              </div>
              <div
                data-label="Temperament"
                onClick={() => handleImageClick(17, "Temperament")}
                style={{ opacity: getImageOpacity(17) }}
              >
                <img src="/Temperament.svg" alt="food" />
              </div>
            </div>

            <button
              className="mt-8 w-[30%] rounded-full px-4 py-2 bg-ceruleanBlue text-white hover:bg-blushPink transition focus:outline-none shadow-lg"
              onClick={handleRecommendationSubmit}
            >
              {isLoading ? "Submitting..." : "submit"}
            </button>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center  ">
          <div className="bg-white p-8 rounded-lg w-[70%] h-[70%] overflow-y-scroll">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="text-center mb-6 text-2xl font-semibold ">
                {currentImageLabel ? `Add ${currentImageLabel}` : "Add Domain"}{" "}
              </div>
              <div className="flex flex-col my-4 ">
                <label className="pb-1">Clinical Prompt</label>
                <textarea
                  {...register("clinicalPrompt")}
                  placeholder="Enter clinical prompt"
                  className="input-field border-2 py-1 h-auto"
                  style={{ overflow: "hidden", resize: "none" }} // Disable manual resizing for a cleaner look
                  onInput={(e) => {
                    e.target.style.height = "auto"; // Reset height to recalculate
                    e.target.style.height = `${e.target.scrollHeight}px`; // Set height based on scroll height
                  }}
                />
              </div>

              <div className="flex flex-col my-4">
                <label className="pb-1">Priority</label>
                <select
                  {...register("priority")}
                  placeholder="Enter Priority"
                  className="select-field border-2 py-1"
                  required
                >
                  <option value="">Select Priority</option>
                  <option value="high">High</option>
                  <option value="moderate">Moderate</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="flex flex-col my-4">
                <label className="pb-1">Recommendation</label>
                <textarea
                  {...register("recommendation")}
                  placeholder="Enter recommendation"
                  className="input-field border-2 py-1"
                  style={{ overflow: "hidden", resize: "none" }} // Disable manual resizing for a cleaner look
                  onInput={(e) => {
                    e.target.style.height = "auto"; // Reset height to recalculate
                    e.target.style.height = `${e.target.scrollHeight}px`; // Set height based on scroll height
                  }}
                />
              </div>

              <div className="flex flex-col my-4">
                <label className="pb-1">Formulation</label>
                <textarea
                  {...register("formulation")}
                  placeholder="Enter Formulation"
                  className="input-field border-2 py-1"
                  style={{ overflow: "hidden", resize: "none" }} // Disable manual resizing for a cleaner look
                  onInput={(e) => {
                    e.target.style.height = "auto"; // Reset height to recalculate
                    e.target.style.height = `${e.target.scrollHeight}px`; // Set height based on scroll height
                  }}
                />
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-blushPink text-white px-8 py-2 rounded-full mr-2 hover:bg-white hover:text-blushPink border-2 border-blushPink transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-ceruleanBlue text-white px-8 py-2 rounded-full hover:bg-white hover:text-ceruleanBlue border-2 border-ceruleanBlue transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isHistoryModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[60%]">
            <div className="text-center mb-6 text-2xl font-semibold">
              Enter Child History
            </div>
            <div className="flex flex-col my-4">
              <label className="pb-1">Child History</label>
              <textarea
                className="border-2 py-2 px-3 w-full"
                rows="4"
                placeholder="Enter child history here..."
                value={childHistory}
                onChange={(e) => setChildHistory(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setIsHistoryModalOpen(false)}
                className="bg-red-500 text-white px-8 py-2 rounded-full mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleHistorySubmit}
                className="bg-custom-gradient text-white px-8 py-2 rounded-full"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {isRecommendationModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[60%]">
            <div className="text-center mb-6 text-2xl font-semibold">
              Enter Report Recommendation
            </div>
            <div className="flex flex-col my-4">
              <label className="pb-1">Recommendation</label>
              <textarea
                className="border-2 py-2 px-3 w-full"
                rows="4"
                placeholder="Enter report recommendation here..."
                value={reportRecommendation}
                onChange={(e) => setReportRecommendation(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setIsRecommendationModalOpen(false)}
                className="bg-red-500 text-white px-8 py-2 rounded-full mr-2"
              >
                Cancel
              </button>
              <button
                // onClick={handleRecommendationSubmit}
                className="bg-custom-gradient text-white px-8 py-2 rounded-full"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {isAssessmentModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-[90%] md:w-[60%]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                Who has done this assessment?
              </h2>
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
                    onChange={(e) =>
                      handleInputChange(index, "username", e.target.value)
                    }
                    value={member.username}
                  >
                    <option value="">Select Name</option>
                    {users.map((user, idx) => (
                      <option
                        key={idx}
                        value={`${user.firstName} ${user.lastName}`}
                      >
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
                + Add Anothe Dropdown
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

            {/* Parents Address Input */}
            <div className="flex flex-col my-4">
              <label className="pb-1 font-medium">Parents [Address]</label>
              <input
                className="border-2 border-gray-300 py-2 px-3 rounded-md w-full"
                type="text"
                placeholder="Parents' Address"
                value={additionalInfo.parents}
                onChange={(e) => handleAddressChange("parents", e.target.value)}
              />
              {/* Address Suggestions */}
              {addressSuggestions.length > 0 && (
                <ul className="border-2 border-gray-300 rounded-md mt-2">
                  {addressSuggestions.map((address, index) => (
                    <li
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() =>
                        handleAdditionalInfoChange("parents", address)
                      }
                    >
                      {address}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Referrer Address Input */}
            <div className="flex flex-col my-4">
              <label className="pb-1 font-medium">Referrer [Address]</label>
              <input
                className="border-2 border-gray-300 py-2 px-3 rounded-md w-full"
                type="text"
                placeholder="Referrer's Address"
                value={additionalInfo.referrer}
                onChange={(e) =>
                  handleAddressChange("referrer", e.target.value)
                }
              />
              {addressSuggestions.length > 0 && (
                <ul className="border-2 border-gray-300 rounded-md mt-2">
                  {addressSuggestions.map((address, index) => (
                    <li
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() =>
                        handleAdditionalInfoChange("referrer", address)
                      }
                    >
                      {address}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* GP Address Input */}
            <div className="flex flex-col my-4">
              <label className="pb-1 font-medium">GP [Address]</label>
              <input
                className="border-2 border-gray-300 py-2 px-3 rounded-md w-full"
                type="text"
                placeholder="GP's Address"
                value={additionalInfo.gp}
                onChange={(e) => handleAddressChange("gp", e.target.value)}
              />
              {addressSuggestions.length > 0 && (
                <ul className="border-2 border-gray-300 rounded-md mt-2">
                  {addressSuggestions.map((address, index) => (
                    <li
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleAdditionalInfoChange("gp", address)}
                    >
                      {address}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Private Provider Address Input */}
            <div className="flex flex-col my-4">
              <label className="pb-1 font-medium">
                Private Provider [Address]
              </label>
              <input
                className="border-2 border-gray-300 py-2 px-3 rounded-md w-full"
                type="text"
                placeholder="Private Provider's Address"
                value={additionalInfo.privateProvider}
                onChange={(e) =>
                  handleAddressChange("privateProvider", e.target.value)
                }
              />
              {addressSuggestions.length > 0 && (
                <ul className="border-2 border-gray-300 rounded-md mt-2">
                  {addressSuggestions.map((address, index) => (
                    <li
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() =>
                        handleAdditionalInfoChange("privateProvider", address)
                      }
                    >
                      {address}
                    </li>
                  ))}
                </ul>
              )}
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

export default Pyramid;
