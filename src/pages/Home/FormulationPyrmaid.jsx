import React, { useState } from "react";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { useNavigate } from "react-router-dom";
import "./home.css";

const FormulationPyramid = () => {
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false); // Modal state
  const [selectedSection, setSelectedSection] = useState(null); // Selected section info
  const [descriptions, setDescriptions] = useState({}); // Descriptions for sections
  const [descriptionInput, setDescriptionInput] = useState(""); // Current input for description

  // Open modal when an image is clicked
  const handleImageClick = (imageId, label) => {
    setSelectedSection({ id: imageId, label }); // Set selected section info
    setModalOpen(true); // Open modal

    // If a description exists for the section, prefill the textarea
    setDescriptionInput(descriptions[label] || "");
  };

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setDescriptionInput(""); // Clear input when modal closes
  };

  // Add or update description for the selected section
  const handleAddDescription = () => {
    if (descriptionInput.trim() !== "") {
      // Save the description in the descriptions state
      setDescriptions((prev) => ({
        ...prev,
        [selectedSection.label]: descriptionInput,
      }));

      // Mark the section as selected (for visual indicator)
      if (!selectedImages.includes(selectedSection.id)) {
        setSelectedImages([...selectedImages, selectedSection.id]);
      }

      // Close the modal after adding description
      handleCloseModal();
    } else {
      alert("Please enter a description.");
    }
  };

  // Proceed to the next step or show an alert
  const handleNextClick = () => {
    if (selectedImages.length === 0) {
      alert("Select at least one category");
    } else {
    //   navigate("/home/options");
    }
  };

  return (
    <>
      <Header />
      <section className="w-full flex gap-4">
        <SideBar />
        <div className="w-full">
          <div className="flex mt-4">
            <img src="/ion_chevron-back.svg" alt="back_arrow" />
            <button className="text-base">Back</button>
          </div>
          <div className="flex justify-center items-center flex-col my-10">
            <h1 className="text-2xl font-semibold">Add Formulation</h1>

            {/* Section Pyramid */}
            <div className="relative">
              <img
                src="/Frame 1261153616.svg"
                alt="food"
                onClick={() => handleImageClick(1, "Variety & Volume")}
                className="cursor-pointer"
              />
            </div>

            <div
              data-label="New Food Learning"
              onClick={() => handleImageClick(2, "New Food Learning")}
              className={`${
                descriptions["New Food Learning"] ? "selected-section" : ""
              }`}
            >
              <img src="/Frame 1261153617.svg" alt="New Food Learning" />
            </div>

            <div
              data-label="Food Mapping"
              onClick={() => handleImageClick(3, "Food Mapping")}
              className={`${
                descriptions["Food Mapping"] ? "selected-section" : ""
              }`}
            >
              <img src="/Frame 1261153618.svg" alt="Food Mapping" />
            </div>

            <div className="flex">
              <div
                data-label="Sensory"
                onClick={() => handleImageClick(4, "Sensory")}
                className={`${
                  descriptions["Sensory"] ? "selected-section" : ""
                }`}
              >
                <img src="/Frame 1261153619.svg" alt="Sensory" />
              </div>
              <div
                data-label="Oral Motor"
                onClick={() => handleImageClick(5, "Oral Motor")}
                className={`${
                  descriptions["Oral Motor"] ? "selected-section" : ""
                }`}
              >
                <img src="/Frame 1261153620.svg" alt="Oral Motor" />
              </div>
            </div>

            <div className="flex">
              <div
                data-label="Self Feeding"
                onClick={() => handleImageClick(6, "Self Feeding")}
                className={`${
                  descriptions["Self Feeding"] ? "selected-section" : ""
                }`}
              >
                <img src="/Frame 1261153621.svg" alt="Self Feeding" />
              </div>
              <div
                data-label="Mealtime Engagement"
                onClick={() => handleImageClick(7, "Mealtime Engagement")}
                className={`${
                  descriptions["Mealtime Engagement"] ? "selected-section" : ""
                }`}
              >
                <img src="/Frame 1261153622.svg" alt="Mealtime Engagement" />
              </div>
            </div>

            {/* Add other sections similarly */}
            {/* ... */}

            <button
              className="mt-8 w-[30%] rounded-full px-4 py-2 bg-custom-gradient text-white"
              onClick={handleNextClick}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {/* Modal for adding description */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={handleCloseModal}>
              X
            </button>
            <h2>{selectedSection?.label}</h2>
            <textarea
              value={descriptionInput}
              onChange={(e) => setDescriptionInput(e.target.value)}
              placeholder="Add Descriptions"
            />
            <button className="btn-add" onClick={handleAddDescription}>
              Add
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FormulationPyramid;
