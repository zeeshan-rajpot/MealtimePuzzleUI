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
      setChildHistoryError(true); // Set error if child history is empty
      return; // Stop submission
    } else {
      setChildHistoryError(false); // Clear any existing error
    }

    try {
      // Create the domains array from selected images
      const domains = selectedImages.map((imageId) => ({
        domainName: imageData[imageId]?.label || "",
        clinicalPrompt: imageData[imageId]?.clinicalPrompt || "",
        priority: imageData[imageId]?.priority || "",
        formulation: imageData[imageId]?.formulation || "",
        recommendation: imageData[imageId]?.recommendation || "",
      }));

      const childUrn = urn; // Assign urn to childUrn

      const token = localStorage.getItem("token");

      // Axios POST request for adding an intervention, with Authorization header
      const response = await axios.post(
        "http://localhost:5001/api/post/Intervention",
        {
          childUrn,
          childHistory, // Include child history in the payload
          domains, // Pass the domains array
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token in the Authorization header
          },
        }
      );

      // Store session data and navigate if the request is successful
      localStorage.setItem("session", response.data.session);
      setSession(response.data.session);
      toast.success("Intervention added successfully!");
      console.log(response.data)

      // Navigate to detail page with the session info
    } catch (err) {
      console.error("Failed to add Assessment:", err);
      toast.error("Failed to add Assessment");
    } finally {
      setIsHistoryModalOpen(false); // Close the modal after submission
      setIsAssessmentModalOpen(true);
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/users");
        setUsers((prevUsers) => [...response.data, ...prevUsers.filter(user => user.isNew)]);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const [showInputs, setShowInputs] = useState(false);

  const handleAddMember = () => {
    setShowInputs(true);
    if (newMember.username && newMember.role) {
      // Add a flag `isNew` to differentiate between API users and locally added members
      const memberWithFlag = { ...newMember, isNew: true };

      setMembers([...members, memberWithFlag]);  // Add new member to members state
      setUsers([...users, memberWithFlag]);      // Add new member to users state

      setNewMember({ username: "", role: "" });  // Reset the input fields
      //  
    } else {
      console.error("Please fill both fields");
      // Show input fields for the new member
    }
  };

  const handleAddDropdown = () => {
    setMembers([...members, { username: "", role: "", isNew: true }]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
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
              <img src="/Frame 1261153616.svg" alt="food" />
            </div>

            <div
              data-label="New Food Learning"
              onClick={() => handleImageClick(2, "New Food Learning")}
              style={{ opacity: getImageOpacity(2) }}
            >
              <img src="/Frame 1261153617.svg" alt="food" />
            </div>

            <div
              data-label="Food Mapping"
              onClick={() => handleImageClick(3, "Food Mapping")}
              style={{ opacity: getImageOpacity(3) }}
            >
              <img src="/Frame 1261153618.svg" alt="food" />
            </div>

            <div className="flex">
              <div
                data-label="Sensory"
                onClick={() => handleImageClick(4, "Sensory")}
                style={{ opacity: getImageOpacity(4) }}
              >
                <img src="/Frame 1261153619.svg" alt="food" />
              </div>

              <div
                data-label="Oral Motor"
                onClick={() => handleImageClick(5, "Oral Motor")}
                style={{ opacity: getImageOpacity(5) }}
              >
                <img src="/Frame 1261153620.svg" alt="food" />
              </div>
            </div>
            <div className="flex">
              <div
                data-label="Self Feeding"
                onClick={() => handleImageClick(6, "Self Feeding")}
                style={{ opacity: getImageOpacity(6) }}
              >
                <img src="/Frame 1261153621.svg" alt="food" />
              </div>
              <div
                data-label="Mealtime Engagement"
                onClick={() => handleImageClick(7, "Mealtime Engagement")}
                style={{ opacity: getImageOpacity(7) }}
              >
                <img src="/Frame 1261153622.svg" alt="food" />
              </div>
            </div>
            <div className="flex mt-4">
              <div
                data-label="Food Exposure"
                onClick={() => handleImageClick(8, "Food Exposure")}
                style={{ opacity: getImageOpacity(8) }}
              >
                <img src="/Frame 1261153624.svg" alt="food" />
              </div>
              <div
                data-label="Mealtime Environment"
                onClick={() => handleImageClick(9, "Mealtime Environment")}
                style={{ opacity: getImageOpacity(9) }}
              >
                <img src="/Frame 1261153625.svg" alt="food" />
              </div>
              <div
                data-label="Flexibility"
                onClick={() => handleImageClick(10, "Flexibility")}
                style={{ opacity: getImageOpacity(10) }}
              >
                <img src="/Frame 1261153626.svg" alt="food" />
              </div>
            </div>
            <div className="flex">
              <div
                data-label="Hunger Cycle"
                onClick={() => handleImageClick(11, "Hunger Cycle")}
                style={{ opacity: getImageOpacity(11) }}
              >
                <img src="/Frame 1261153627.svg" alt="food" />
              </div>
              <div
                data-label="Mealtime Roles"
                onClick={() => handleImageClick(12, "Mealtime Roles")}
                style={{ opacity: getImageOpacity(12) }}
              >
                <img src="/Frame 1261153628.svg" alt="food" />
              </div>
              <div
                data-label="Caregivers Influence"
                onClick={() => handleImageClick(13, "Caregivers Influence")}
                style={{ opacity: getImageOpacity(13) }}
              >
                <img src="/Frame 1261153629.svg" alt="food" />
              </div>
              <div
                data-label="Calm Mealtimes"
                onClick={() => handleImageClick(14, "Calm Mealtimes")}
                style={{ opacity: getImageOpacity(14) }}
              >
                <img src="/Frame 1261153630.svg" alt="food" />
              </div>
            </div>
            <div className="flex">
              <div
                data-label="Development"
                onClick={() => handleImageClick(15, "Development")}
                style={{ opacity: getImageOpacity(15) }}
              >
                <img src="/Frame 1261153631.svg" alt="food" />
              </div>
              <div
                data-label="Medical / Nutrition"
                onClick={() => handleImageClick(16, "Medical / Nutrition")}
                style={{ opacity: getImageOpacity(16) }}
              >
                <img src="/Frame 1261153632.svg" alt="food" />
              </div>
              <div
                data-label="Temperament"
                onClick={() => handleImageClick(17, "Temperament")}
                style={{ opacity: getImageOpacity(17) }}
              >
                <img src="/Frame 1261153633.svg" alt="food" />
              </div>
            </div>

            <button
              className="mt-8 w-[30%] rounded-full px-4 py-2 bg-ceruleanBlue text-white hover:bg-blushPink transition focus:outline-none shadow-lg"
              onClick={handleNextClick}
            >
              {isLoading ? "Submitting..." : "Next"}
            </button>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[70%] ">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="text-center mb-6 text-2xl font-semibold ">
                {currentImageLabel ? `Add ${currentImageLabel}` : "Add Domain"}{" "}
              </div>
              <div className="flex flex-col my-4 ">
                <label className="pb-1">Clinical Prompt</label>
                <input
                  {...register("clinicalPrompt")}
                  placeholder="Enter clinical prompt"
                  className="input-field border-2 py-1"
                  required
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
                <input
                  {...register("recommendation")}
                  placeholder="Enter recommendation"
                  className="input-field border-2 py-1"
                  required
                />
              </div>

              <div className="flex flex-col my-4">
                <label className="pb-1">Formulation</label>
                <input
                  {...register("formulation")}
                  placeholder="Enter Formulation"
                  className="input-field border-2 py-1"
                  required
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

      {isAssessmentModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-[90%] md:w-[60%]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Who has done this assessment?</h2>
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
                    onChange={(e) => handleNewMemberChange("role", e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-2 rounded-full hover:from-blue-600 hover:to-green-600 transition"
                    onClick={handleAddMember}
                  >
                    Save
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
                    onChange={(e) => handleInputChange(index, "username", e.target.value)}
                    value={member.username}
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
                    onChange={(e) => handleInputChange(index, "role", e.target.value)}
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

export default Pyramid;