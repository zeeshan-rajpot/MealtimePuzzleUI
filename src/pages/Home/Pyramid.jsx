import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import { useAddInterventionMutation } from "../../features/Forms/Intervention";
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Pyramid = () => {
  const { register, handleSubmit, setValue, reset } = useForm();
  const { urn, childName } = useParams();
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageLabel, setCurrentImageLabel] = useState("");
  const [imageId, setImageId] = useState(null);
  const [imageData, setImageData] = useState({});
  const [imageDataCounter, setImageDataCounter] = useState(0);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [childHistory, setChildHistory] = useState("");
  const [childHistoryError, setChildHistoryError] = useState(false);

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
  
      const token = localStorage.getItem('token'); 

      // Axios POST request for adding an intervention, with Authorization header
      const response = await axios.post('http://localhost:5001/api/post/Intervention', {
        childUrn,
        childHistory, // Include child history in the payload
        domains, // Pass the domains array
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token in the Authorization header
        }
      });
  
  
      // Store session data and navigate if the request is successful
      localStorage.setItem("session", response.data.session);
      toast.success("Intervention added successfully!");
  
      // Navigate to detail page with the session info
      navigate(`/home/detailpage/${urn}/${response.data.session}`);
    } catch (err) {
      // Log the error and show a toast notification
      console.error("Failed to add intervention:", err);
      toast.error("Failed to add intervention");
    } finally {
      setIsHistoryModalOpen(false); // Close modal regardless of success or error
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
              className="mt-8 w-[30%] rounded-full px-4 py-2 bg-custom-gradient text-white"
              onClick={handleNextClick}
            >
              {isLoading ? "Submitting" : "Next"}
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
                  className="bg-red-500 text-white px-8 py-2 rounded-full mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-custom-gradient text-white px-8 py-2 rounded-full"
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
              {childHistoryError && (
                <span className="text-red-500 text-sm mt-1">
                  Child history is required.
                </span>
              )}
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
    </>
  );
};

export default Pyramid;
