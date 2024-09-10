import React, { useState } from "react";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { useNavigate } from "react-router-dom";

const Pyramid = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const navigate = useNavigate();


  const handleImageClick = (imageId) => {
    if (selectedImages.includes(imageId)) {
      setSelectedImages(selectedImages.filter((id) => id !== imageId));
    } else if (selectedImages.length < 3) {
      setSelectedImages([...selectedImages, imageId]);
    }
  };

  const getImageStyle = (imageId) => ({
    opacity: selectedImages.includes(imageId) ? 1 : 0.5,
    cursor: "pointer",
  });

  const handleNext = () => {
    if (selectedImages.length === 3) {
      navigate("/form", { state: { selectedImages } });
    } else {
      alert("Please select 3 images.");
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
            <img
              src="/Frame 1261153616.svg"
              alt="food"
              className="mt-8"
              onClick={() => handleImageClick(1)}
              style={getImageStyle(1)}
            />
            <img
              src="/Frame 1261153617.svg"
              alt="food"
              onClick={() => handleImageClick(2)}
              style={getImageStyle(2)}
            />
            <img
              src="/Frame 1261153618.svg"
              alt="food"
              onClick={() => handleImageClick(3)}
              style={getImageStyle(3)}
            />
            <div className="flex">
              <img
                src="/Frame 1261153619.svg"
                alt="food"
                onClick={() => handleImageClick(4)}
                style={getImageStyle(4)}
              />
              <img
                src="/Frame 1261153620.svg"
                alt="food"
                onClick={() => handleImageClick(5)}
                style={getImageStyle(5)}
              />
            </div>
            <div className="flex">
              <img
                src="/Frame 1261153621.svg"
                alt="food"
                onClick={() => handleImageClick(6)}
                style={getImageStyle(6)}
              />
              <img
                src="/Frame 1261153622.svg"
                alt="food"
                onClick={() => handleImageClick(7)}
                style={getImageStyle(7)}
              />
            </div>
            <div className="flex mt-4">
              <img
                src="/Frame 1261153624.svg"
                alt="food"
                onClick={() => handleImageClick(8)}
                style={getImageStyle(8)}
              />
              <img
                src="/Frame 1261153625.svg"
                alt="food"
                onClick={() => handleImageClick(9)}
                style={getImageStyle(9)}
              />
              <img
                src="/Frame 1261153626.svg"
                alt="food"
                onClick={() => handleImageClick(10)}
                style={getImageStyle(10)}
              />
            </div>
            <div className="flex">
              <img
                src="/Frame 1261153627.svg"
                alt="food"
                onClick={() => handleImageClick(11)}
                style={getImageStyle(11)}
              />
              <img
                src="/Frame 1261153628.svg"
                alt="food"
                onClick={() => handleImageClick(12)}
                style={getImageStyle(12)}
              />
              <img
                src="/Frame 1261153629.svg"
                alt="food"
                onClick={() => handleImageClick(13)}
                style={getImageStyle(13)}
              />
              <img
                src="/Frame 1261153630.svg"
                alt="food"
                onClick={() => handleImageClick(14)}
                style={getImageStyle(14)}
              />
            </div>
            <div className="flex">
              <img
                src="/Frame 1261153631.svg"
                alt="food"
                onClick={() => handleImageClick(15)}
                style={getImageStyle(15)}
              />
              <img
                src="/Frame 1261153632.svg"
                alt="food"
                onClick={() => handleImageClick(16)}
                style={getImageStyle(16)}
              />
              <img
                src="/Frame 1261153633.svg"
                alt="food"
                onClick={() => handleImageClick(17)}
                style={getImageStyle(17)}
              />
            </div>

            <button
              className="mt-8 w-[30%] rounded-full px-4 py-2 bg-custom-gradient text-white"
              onClick={handleNext}
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
