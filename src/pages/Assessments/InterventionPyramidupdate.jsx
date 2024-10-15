import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
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

  const handleModalSave = () => {
    if (
      !modalData.clinicalPrompt ||
      !modalData.priority ||
      !modalData.formulation ||
      !modalData.recommendation
    ) {
      toast.error("All fields are required");
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
        console.log("label", label);

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

      // Navigate to detail page
      // navigate(`/home/detailpage/${urn}/${session}`);
    } catch (err) {
      console.error("Failed to add intervention:", err);
      toast.error("Failed to add intervention");
    } finally {
      setIsHistoryModalOpen(false); // Close the modal after submission
      setIsAssessmentModalOpen(true);
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
  const [members, setMembers] = useState([
    { name: "", role: "" }, // Initialize with one empty member
  ]);

  useEffect(() => {
    // Fetch users from the API when the component mounts
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/users");
        setUsers(response.data); // Assuming response.data is the array of users
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const [showInputs, setShowInputs] = useState(false);

  const handleAddMember = () => {
    setShowInputs(true);
  };

  const handleAddDropdown = () => {
    setMembers([...members, { name: "", role: "" }]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
    localStorage.setItem("accessors", JSON.stringify(updatedMembers));
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
              <img src="/Frame 1261153616.svg" alt="food" />
            </div>

            <div
              data-label="New Food Learning"
              onClick={() => handleImageClick(2, "New Food Learning")}
              style={{ opacity: getImageOpacity("New Food Learning") }}
            >
              <img src="/Frame 1261153617.svg" alt="food" />
            </div>

            <div
              data-label="Food Mapping"
              onClick={() => handleImageClick(3, "Food Mapping")}
              style={{ opacity: getImageOpacity("Food Mapping") }}
            >
              <img src="/Frame 1261153618.svg" alt="food" />
            </div>

            <div className="flex">
              <div
                data-label="Sensory"
                onClick={() => handleImageClick(4, "Sensory")}
                style={{ opacity: getImageOpacity("Sensory") }}
              >
                <img src="/Frame 1261153619.svg" alt="food" />
              </div>

              <div
                data-label="Oral Motor"
                onClick={() => handleImageClick(5, "Oral Motor")}
                style={{ opacity: getImageOpacity("Oral Motor") }}
              >
                <img src="/Frame 1261153620.svg" alt="food" />
              </div>
            </div>
            <div className="flex">
              <div
                data-label="Self Feeding"
                onClick={() => handleImageClick(6, "Self Feeding")}
                style={{ opacity: getImageOpacity("Self Feeding") }}
              >
                <img src="/Frame 1261153621.svg" alt="food" />
              </div>
              <div
                data-label="Mealtime Engagement"
                onClick={() => handleImageClick(7, "Mealtime Engagement")}
                style={{ opacity: getImageOpacity("Mealtime Engagement") }}
              >
                <img src="/Frame 1261153622.svg" alt="food" />
              </div>
            </div>
            <div className="flex mt-4">
              <div
                data-label="Food Exposure"
                onClick={() => handleImageClick(8, "Food Exposure")}
                style={{ opacity: getImageOpacity("Food Exposure") }}
              >
                <img src="/Frame 1261153624.svg" alt="food" />
              </div>
              <div
                data-label="Mealtime Environment"
                onClick={() => handleImageClick(9, "Mealtime Environment")}
                style={{ opacity: getImageOpacity("Mealtime Environment") }}
              >
                <img src="/Frame 1261153625.svg" alt="food" />
              </div>
              <div
                data-label="Flexibility"
                onClick={() => handleImageClick(10, "Flexibility")}
                style={{ opacity: getImageOpacity("Flexibility") }}
              >
                <img src="/Frame 1261153626.svg" alt="food" />
              </div>
            </div>
            <div className="flex">
              <div
                data-label="Hunger Cycle"
                onClick={() => handleImageClick(11, "Hunger Cycle")}
                style={{ opacity: getImageOpacity("Hunger Cycle") }}
              >
                <img src="/Frame 1261153627.svg" alt="food" />
              </div>
              <div
                data-label="Mealtime Roles"
                onClick={() => handleImageClick(12, "Mealtime Roles")}
                style={{ opacity: getImageOpacity("Mealtime Roles") }}
              >
                <img src="/Frame 1261153628.svg" alt="food" />
              </div>
              <div
                data-label="Caregivers Influence"
                onClick={() => handleImageClick(13, "Caregivers Influence")}
                style={{ opacity: getImageOpacity("Caregivers Influence") }}
              >
                <img src="/Frame 1261153629.svg" alt="food" />
              </div>
              <div
                data-label="Calm Mealtimes"
                onClick={() => handleImageClick(14, "Calm Mealtimes")}
                style={{ opacity: getImageOpacity("Calm Mealtimes") }}
              >
                <img src="/Frame 1261153630.svg" alt="food" />
              </div>
            </div>
            <div className="flex">
              <div
                data-label="Development"
                onClick={() => handleImageClick(15, "Development")}
                style={{ opacity: getImageOpacity("Development") }}
              >
                <img src="/Frame 1261153631.svg" alt="food" />
              </div>
              <div
                data-label="Medical / Nutrition"
                onClick={() => handleImageClick(16, "Medical or Nutrition")}
                style={{ opacity: getImageOpacity("Medical or Nutrition") }}
              >
                <img src="/Frame 1261153632.svg" alt="food" />
              </div>
              <div
                data-label="Temperament"
                onClick={() => handleImageClick(17, "Temperament")}
                style={{ opacity: getImageOpacity("Temperament") }}
              >
                <img src="/Frame 1261153633.svg" alt="food" />
              </div>
            </div>

            <button
              className="mt-8 w-[30%] rounded-full px-4 py-2 bg-custom-gradient text-white"
              onClick={handleNextClick}
            >
              Update
            </button>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[70%]">
            <div className="text-center mb-3 text-lg font-semibold ">
              {currentImageLabel ? `Edit ${currentImageLabel}` : "Add Domain"}
            </div>

            <div className="flex flex-col my-2">
              <label>Clinical Prompt</label>
              <input
                value={modalData.clinicalPrompt}
                onChange={(e) =>
                  setModalData((prev) => ({
                    ...prev,
                    clinicalPrompt: e.target.value,
                  }))
                }
                placeholder="Enter clinical prompt"
                className="input-field border-2 py-1"
                required
              />
            </div>

            <div className="flex flex-col my-2">
              <label>Priority</label>
              <select
                value={modalData.priority}
                onChange={(e) =>
                  setModalData((prev) => ({
                    ...prev,
                    priority: e.target.value,
                  }))
                }
                className="select-field border-2 py-1"
                required
              >
                <option value="">Select Priority</option>
                <option value="high">High</option>
                <option value="moderate">Moderate</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="flex flex-col my-2">
              <label>Recommendation</label>
              <input
                value={modalData.recommendation}
                onChange={(e) =>
                  setModalData((prev) => ({
                    ...prev,
                    recommendation: e.target.value,
                  }))
                }
                placeholder="Enter recommendation"
                className="input-field border-2 py-1"
                required
              />
            </div>

            <div className="flex flex-col my-2">
              <label>Formulation</label>
              <input
                value={modalData.formulation}
                onChange={(e) =>
                  setModalData((prev) => ({
                    ...prev,
                    formulation: e.target.value,
                  }))
                }
                placeholder="Enter Formulation"
                className="input-field border-2 py-1"
                required
              />
            </div>

            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 text-white px-8 py-2 rounded-full mr-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleModalSave}
                className="bg-custom-gradient text-white px-8 py-2 rounded-full"
              >
                Save
              </button>
            </div>
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
              <button
                onClick={handleAddMember}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Add Member
              </button>
            </div>
            {showInputs && (
              <>
                <div className="flex flex-col my-4">
                  <label className="pb-1 font-medium">Name</label>
                  <input
                    className="border-2 border-gray-300 py-2 px-3 rounded-md w-full focus:outline-none focus:border-blue-500"
                    type="text"
                    placeholder="Enter name"
                    onChange={(e) =>
                      handleInputChange(0, "name", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="flex flex-col my-4">
                  <label className="pb-1 font-medium">Role</label>
                  <input
                    className="border-2 border-gray-300 py-2 px-3 rounded-md w-full focus:outline-none focus:border-blue-500"
                    type="text"
                    placeholder="Enter role"
                    onChange={(e) =>
                      handleInputChange(0, "role", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="flex justify-center">
                  <button className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-2 rounded-full hover:from-blue-600 hover:to-green-600 transition">
                    save
                  </button>
                </div>
              </>
            )}
            {members.map((member, index) => (
              <div key={index} className="flex space-x-4 items-center my-4">
                <div className="flex flex-col w-1/2">
                  <label className="pb-1 font-medium">Select Name</label>
                  <select
                    className="border-2 border-gray-300 py-2 px-3 rounded-md w-full focus:outline-none focus:border-blue-500"
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                    value={member.name}
                  >
                    <option value="">Select Name</option>
                    {users.map((user, idx) => (
                      <option key={idx} value={user.username}>
                        {user.username}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col w-1/2">
                  <label className="pb-1 font-medium">Select Role</label>
                  <select
                    className="border-2 border-gray-300 py-2 px-3 rounded-md w-full focus:outline-none focus:border-blue-500"
                    onChange={(e) =>
                      handleInputChange(index, "role", e.target.value)
                    }
                    value={member.role}
                  >
                    <option value="">Select Role</option>
                    {users.map((user, idx) => (
                      <option key={idx} value={user.role}>
                        {user.role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            {/* Add more dropdowns */}
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

            <div className="flex flex-col my-4">
              <label className="pb-1 font-medium">Parents [Address]</label>
              <input
                className="border-2 border-gray-300 py-2 px-3 rounded-md w-full"
                type="text"
                placeholder="Parents' Address"
                value={additionalInfo.parents}
                onChange={(e) =>
                  handleAdditionalInfoChange("parents", e.target.value)
                }
              />
            </div>

            <div className="flex flex-col my-4">
              <label className="pb-1 font-medium">Referrer [Address]</label>
              <input
                className="border-2 border-gray-300 py-2 px-3 rounded-md w-full"
                type="text"
                placeholder="Referrer's Address"
                value={additionalInfo.referrer}
                onChange={(e) =>
                  handleAdditionalInfoChange("referrer", e.target.value)
                }
              />
            </div>

            <div className="flex flex-col my-4">
              <label className="pb-1 font-medium">GP [Address]</label>
              <input
                className="border-2 border-gray-300 py-2 px-3 rounded-md w-full"
                type="text"
                placeholder="GP's Address"
                value={additionalInfo.gp}
                onChange={(e) =>
                  handleAdditionalInfoChange("gp", e.target.value)
                }
              />
            </div>

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
                  handleAdditionalInfoChange("privateProvider", e.target.value)
                }
              />
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
