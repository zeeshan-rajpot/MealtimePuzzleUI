import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import { useAddInterventionMutation } from "../../features/Forms/Intervention";
import toast from "react-hot-toast";

const InterventionPyramid = () => {
  const { register, handleSubmit, setValue, reset } = useForm();
  const { urn } = useParams();
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageLabel, setCurrentImageLabel] = useState("");
  const [imageId, setImageId] = useState(null);
  const [imageDataCounter, setImageDataCounter] = useState(0); // Counter for images with data

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
      const storedData = JSON.parse(localStorage.getItem("stepperInfo")) || {};
      const imageData = storedData[imageId] || {};
      setValue("clinicalPrompt", imageData.clinicalPrompt || "");
      setValue("priority", imageData.priority || "");
      setValue("recommendation", imageData.recommendation || "");
    }
  }, [imageId, setValue]);

  const handleNextClick = async () => {
    if (selectedImages.length === 0) {
      alert("Select at least one category");
    } else {
      try {
        const storedData =
          JSON.parse(localStorage.getItem("stepperInfo")) || {};
        const domains = selectedImages.map((imageId) => ({
          domainName: storedData[imageId]?.label || "",
          clinicalPrompt: storedData[imageId]?.clinicalPrompt || "",
          priority: storedData[imageId]?.priority || "",
          recommendation: storedData[imageId]?.recommendation || "",
        }));

        const childUrn = urn;

        const response = await addIntervention({ childUrn, domains }).unwrap();
        console.log("Intervention added successfully:", response);
        localStorage.setItem("session", response.session);
        toast.success("Intervention added successfully!");
        navigate(`/home/detailpage/${childUrn}/${response?.session}`);
      } catch (err) {
        console.error("Failed to add intervention:", err);
        toast.error("Failed to add intervention");
      }
    }
  };

  const onClose = () => {
    setIsModalOpen(false);
  };

  const onSubmit = (data) => {
    const storedData = JSON.parse(localStorage.getItem("stepperInfo")) || {};
    storedData[imageId] = {
      ...data,
      label: currentImageLabel, // Store label for API
    };
    localStorage.setItem("stepperInfo", JSON.stringify(storedData));
    setImageDataCounter((prevCount) => prevCount + 1); 
    setIsModalOpen(false);
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
            <h1 className="text-2xl font-semibold">Select The Domain</h1>
            <div
              data-label="Variety & Volume"
              onClick={() => handleImageClick(1, "Variety & Volume")}
              className="mt-8"
            >
              <img src="/VarietyandVolume.svg" alt="food" />
            </div>

            <div
              data-label="New Food Learning"
              onClick={() => handleImageClick(2, "New Food Learning")}
            >
              <img src="/NewFoodLearning.svg" alt="food" />
            </div>

            <div
              data-label="Food Mapping"
              onClick={() => handleImageClick(3, "Food Mapping")}
            >
              <img src="/FoodMapping.svg" alt="food" />
            </div>

            <div className="flex">
              <div
                data-label="Sensory"
                onClick={() => handleImageClick(4, "Sensory")}
              >
                <img src="/Sensory.svg" alt="food" />
              </div>

              <div
                data-label="Oral Motor"
                onClick={() => handleImageClick(5, "Oral Motor")}
              >
                <img src="/OralMotor.svg" alt="food" />
              </div>
            </div>
            <div className="flex">
              <div
                data-label="Self Feeding"
                onClick={() => handleImageClick(6, "Self Feeding")}
              >
                <img src="/SelfFeeding.svg" alt="food" />
              </div>
              <div
                data-label="Mealtime Engagement"
                onClick={() => handleImageClick(7, "Mealtime Engagement")}
              >
                <img src="/MealtimeEngagement.svg" alt="food" />
              </div>
            </div>
            <div className="flex mt-4">
              <div
                data-label="Food Exposure"
                onClick={() => handleImageClick(8, "Food Exposure")}
              >
                <img src="/FoodExposure.svg" alt="food" />
              </div>
              <div
                data-label="Mealtime Environment"
                onClick={() => handleImageClick(9, "Mealtime Environment")}
              >
                <img src="/MealtimeEnvironment.svg" alt="food" />
              </div>
              <div
                data-label="Flexibility"
                onClick={() => handleImageClick(10, "Flexibility")}
              >
                <img src="/Flexibility.svg" alt="food" />
              </div>
            </div>
            <div className="flex">
              <div
                data-label="Hunger Cycle"
                onClick={() => handleImageClick(11, "Hunger Cycle")}
              >
                <img src="/HungerCycle.svg" alt="food" />
              </div>
              <div
                data-label="Mealtime Roles"
                onClick={() => handleImageClick(12, "Mealtime Roles")}
              >
                <img src="/MealtimeRoles.svg" alt="food" />
              </div>
              <div
                data-label="Caregivers Influence"
                onClick={() => handleImageClick(13, "Caregivers Influence")}
              >
                <img src="/CaregiversInfluence.svg" alt="food" />
              </div>
              <div
                data-label="Calm Mealtimes"
                onClick={() => handleImageClick(14, "Calm Mealtimes")}
              >
                <img src="/CalmMealtime.svg" alt="food" />
              </div>
            </div>
            <div className="flex">
              <div
                data-label="Development"
                onClick={() => handleImageClick(15, "Development")}
              >
                <img src="/Development.svg" alt="food" />
              </div>
              <div
                data-label="Medical / Nutrition"
                onClick={() => handleImageClick(16, "Medical or Nutrition")}
              >
                <img src="/MedicalNutrition.svg" alt="food" />
              </div>
              <div
                data-label="Temperament"
                onClick={() => handleImageClick(17, "Temperament")}
              >
                <img src="/Temperament.svg" alt="food" />
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
          <div className="bg-white p-8 rounded-lg w-1/2">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="text-center mb-3 text-lg font-semibold ">
                Add Domain
              </div>
              <div className="flex flex-col my-2 ">
                <label>Clinical Prompt</label>
                <input
                  {...register("clinicalPrompt")}
                  placeholder="Enter clinical prompt"
                  className="input-field border-2 py-1"
                  required
                />
              </div>

              <div className="flex flex-col my-2">
                <label>Priority</label>
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

              <div className="flex flex-col my-2">
                <label>Recommendation</label>
                <input
                  {...register("recommendation")}
                  placeholder="Enter recommendation"
                  className="input-field border-2 py-1"
                  required
                />
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-red-500 text-white px-8 py-2 rounded-full mr-2"
                >
                  Cancel
                </button>
                <button
                  type="Submit"
                  className="bg-custom-gradient text-white px-8 py-2 rounded-full"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default InterventionPyramid;
