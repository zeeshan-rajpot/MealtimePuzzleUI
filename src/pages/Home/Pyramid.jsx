import React, { useState } from "react";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { useNavigate } from "react-router-dom";

const Pyramid = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageClick = (imageId, label) => {
    let updatedSelectedImages;

    if (selectedImages.includes(imageId)) {
      updatedSelectedImages = selectedImages.filter((id) => id !== imageId);
    } else {
      updatedSelectedImages = [...selectedImages, imageId];
    }

    setSelectedImages(updatedSelectedImages);

    // Retrieve the current selected image labels from local storage
    let selectedLabels =
      JSON.parse(localStorage.getItem("selectedImageLabels")) || [];

    // If deselecting, remove from the local storage list as well
    if (selectedImages.includes(imageId)) {
      selectedLabels = selectedLabels.filter(
        (storedLabel) => storedLabel !== label
      );
    } else {
      // Otherwise, add the new label to the list
      selectedLabels.push(label);
    }

    // Save the updated list to local storage
    localStorage.setItem("selectedImageLabels", JSON.stringify(selectedLabels));
  };

  const getImageStyle = (imageId) => ({
    opacity: selectedImages.includes(imageId) ? 1 : 0.5,
    cursor: "pointer",
  });

  const handleNextClick = () => {
    if (selectedImages.length === 0) {
      alert("Select at least one category");
    } else {
      // Proceed to next step or navigate
      navigate("/home/stepper");
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
          <div className="flex justify-center items-center flex-col my-10 ">
            <h1 className="text-2xl font-semibold">Select The Domain</h1>
            <div
              data-label="Variety & Volume"
              onClick={() => handleImageClick(1, "Variety & Volume")}
              className="mt-8"
            >
              <img
                src="/Frame 1261153616.svg"
                alt="food"
                style={getImageStyle(1)}
              />
            </div>

            <div
              data-label="New Food Learning"
              onClick={() => handleImageClick(2, "New Food Learning")}
            >
              <img
                src="/Frame 1261153617.svg"
                alt="food"
                style={getImageStyle(2)}
              />
            </div>

            <div
              data-label="Food Mapping"
              onClick={() => handleImageClick(3, "Food Mapping")}
            >
              <img
                src="/Frame 1261153618.svg"
                alt="food"
                style={getImageStyle(3)}
              />
            </div>

            <div className="flex">
              <div
                data-label="Sensory"
                onClick={() => handleImageClick(4, "Sensory")}
              >
                <img
                  src="/Frame 1261153619.svg"
                  alt="food"
                  style={getImageStyle(4)}
                />
              </div>

              <div
                data-label="Oral Motor"
                onClick={() => handleImageClick(5, "Oral Motor")}
              >
                <img
                  src="/Frame 1261153620.svg"
                  alt="food"
                  style={getImageStyle(5)}
                />
              </div>
            </div>
            <div className="flex">
              <div
                data-label="Self Feeding"
                onClick={() => handleImageClick(6, "Self Feeding")}
              >
                <img
                  src="/Frame 1261153621.svg"
                  alt="food"
                  style={getImageStyle(6)}
                />
              </div>
              <div
                data-label="Mealtime Engagement"
                onClick={() => handleImageClick(7, "Mealtime Engagement")}
              >
                <img
                  src="/Frame 1261153622.svg"
                  alt="food"
                  style={getImageStyle(7)}
                />
              </div>
            </div>
            <div className="flex mt-4">
              <div
                data-label="Food Exposure"
                onClick={() => handleImageClick(8, "Food Exposure")}
              >
                <img
                  src="/Frame 1261153624.svg"
                  alt="food"
                  style={getImageStyle(8)}
                />
              </div>
              <div
                data-label="Mealtime Environment"
                onClick={() => handleImageClick(9, "Mealtime Environment")}
              >
                <img
                  src="/Frame 1261153625.svg"
                  alt="food"
                  style={getImageStyle(9)}
                />
              </div>
              <div
                data-label="Flexibility"
                onClick={() => handleImageClick(10, "Flexibility")}
              >
                <img
                  src="/Frame 1261153626.svg"
                  alt="food"
                  style={getImageStyle(10)}
                />
              </div>
            </div>
            <div className="flex">
              <div
                data-label="Hunger Cycle"
                onClick={() => handleImageClick(11, "Hunger Cycle")}
              >
                <img
                  src="/Frame 1261153627.svg"
                  alt="food"
                  style={getImageStyle(11)}
                />
              </div>
              <div
                data-label="Mealtime Roles"
                onClick={() => handleImageClick(12, "Mealtime Roles")}
              >
                <img
                  src="/Frame 1261153628.svg"
                  alt="food"
                  style={getImageStyle(12)}
                />
              </div>
              <div
                data-label="Caregivers Influence"
                onClick={() => handleImageClick(13, "Caregivers Influence")}
              >
                <img
                  src="/Frame 1261153629.svg"
                  alt="food"
                  style={getImageStyle(13)}
                />
              </div>
              <div
                data-label="Calm Mealtimes"
                onClick={() => handleImageClick(14, "Calm Mealtimes")}
              >
                <img
                  src="/Frame 1261153630.svg"
                  alt="food"
                  style={getImageStyle(14)}
                />
              </div>
            </div>
            <div className="flex">
              <div
                data-label="Development"
                onClick={() => handleImageClick(15, "Development")}
              >
                <img
                  src="/Frame 1261153631.svg"
                  alt="food"
                  style={getImageStyle(15)}
                />
              </div>
              <div
                data-label="Medical / Nutrition"
                onClick={() => handleImageClick(16, "Medical / Nutrition")}
              >
                <img
                  src="/Frame 1261153632.svg"
                  alt="food"
                  style={getImageStyle(16)}
                />
              </div>
              <div
                data-label="Temperament"
                onClick={() => handleImageClick(17, "Temperament")}
              >
                <img
                  src="/Frame 1261153633.svg"
                  alt="food"
                  style={getImageStyle(17)}
                />
              </div>
            </div>

            <button
              className="mt-8 w-[30%] rounded-full px-4 py-2 bg-custom-gradient text-white"
              onClick={handleNextClick}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Pyramid;
