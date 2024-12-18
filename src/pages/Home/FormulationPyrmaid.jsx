import React, { useState } from "react";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./home.css";
import toast from "react-hot-toast";
import { useAddFormulationMutation } from "../../features/Forms/Pyramids";

const FormulationPyramid = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  const { urn } = useParams();

  const [addFormulation, { isLoading, isError, error }] =
    useAddFormulationMutation();

  const [selectedImages, setSelectedImages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [descriptions, setDescriptions] = useState({});
  const [descriptionInput, setDescriptionInput] = useState("");

  const handleImageClick = (imageId, label) => {
    setSelectedSection({ id: imageId, label });
    setModalOpen(true);
    setDescriptionInput(descriptions[label] || "");
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setDescriptionInput("");
  };

  const handleAddDescription = () => {
    if (descriptionInput.trim() !== "") {
      setDescriptions((prev) => ({
        ...prev,
        [selectedSection.label]: descriptionInput,
      }));
      if (!selectedImages.includes(selectedSection.id)) {
        setSelectedImages([...selectedImages, selectedSection.id]);
      }
      handleCloseModal();
    } 
  };

  const totalSections = 17;

  const descriptionsCount = Object.keys(descriptions).length;

  const domains = Object.keys(descriptions).map((label) => ({
    domainName: label,
    description: descriptions[label],
  }));

  const handleNextClick = async () => {
    console.log(domains);
    if (selectedImages.length === 0) {
      alert("Add at least one description");
      return;
    }

    try {
      await addFormulation({ urn, domains }).unwrap();
      // console.log("Formulation added successfully!");
      navigate(`/home/options/${urn}`);
      toast.success("Formulation added successfully!");
    } catch (err) {
      console.error("Failed to add formulation:", err);
      toast.error("Failed to add formulation");
    }
  };
  return (
    <>
      <Header />
      <section className="w-full flex gap-4">
        <SideBar />
        <div className="w-full">
          <div className="flex mt-4 justify-between items-center">
            <div className="flex" onClick={handleBack}>
              <img src="/ion_chevron-back.svg" alt="back_arrow" />
              <button className="text-base">Back</button>
            </div>

            <div>
              <p className="mt-4 mx-20 font-semibold text-large">
                Descriptions added: {descriptionsCount}/{totalSections}
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center flex-col my-10">
            <h1 className="text-2xl font-semibold">Add Formulation</h1>

            {/* Section Pyramid */}
            <div
              className="relative group mt-10 cursor-pointer"
              onClick={() => handleImageClick(1, "Variety & Volume")}
            >
              <img src="/VarietyandVolume.svg" alt="food" />
              <div className="tooltip absolute top-0 left-0 z-20 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-sm px-3 py-1 rounded">
                {descriptions["Variety & Volume"]
                  ? descriptions["Variety & Volume"]
                  : "Empty"}
              </div>
            </div>

            <div
              className="relative group cursor-pointer"
              onClick={() => handleImageClick(2, "New Food Learning")}
            >
              <img src="/NewFoodLearning.svg" alt="New Food Learning" />
              <div className="tooltip absolute top-0 left-0 z-20 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-sm px-3 py-1 rounded">
                {descriptions["New Food Learning"]
                  ? descriptions["New Food Learning"]
                  : "Empty"}
              </div>
            </div>

            <div
              className="relative group cursor-pointer"
              onClick={() => handleImageClick(3, "Food Mapping")}
            >
              <img src="/FoodMapping.svg" alt="Food Mapping" />
              <div className="tooltip absolute top-0 left-0 z-20 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-sm px-3 py-1 rounded">
                {descriptions["Food Mapping"]
                  ? descriptions["Food Mapping"]
                  : "Empty"}
              </div>
            </div>

            <div className="flex">
              <div
                className="relative group cursor-pointer"
                onClick={() => handleImageClick(4, "Sensory")}
              >
                <img src="/Sensory.svg" alt="Sensory" />
                <div className="tooltip absolute top-0 left-0 z-20 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-sm px-3 py-1 rounded">
                  {descriptions["Sensory"] ? descriptions["Sensory"] : "Empty"}
                </div>
              </div>
              <div
                className="relative group cursor-pointer"
                onClick={() => handleImageClick(5, "Oral Motor")}
              >
                <img src="/OralMotor.svg" alt="Oral Motor" />
                <div className="tooltip absolute top-0 left-0 z-20 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-sm px-3 py-1 rounded">
                  {descriptions["Oral Motor"]
                    ? descriptions["Oral Motor"]
                    : "Empty"}
                </div>
              </div>
            </div>

            <div className="flex">
              <div
                data-label="Self Feeding"
                onClick={() => handleImageClick(6, "Self Feeding")}
                className="relative group cursor-pointer"
              >
                <img src="/SelfFeeding.svg" alt="food" />
                <div className="tooltip absolute top-0 left-0 z-20 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-sm px-3 py-1 rounded">
                  {descriptions["Self Feeding"]
                    ? descriptions["Self Feeding"]
                    : "Empty"}
                </div>
              </div>
              <div
                data-label="Mealtime Engagement"
                onClick={() => handleImageClick(7, "Mealtime Engagement")}
                className="relative group cursor-pointer"
              >
                <img src="/MealtimeEngagement.svg" alt="food" />
                <div className="tooltip absolute top-0 left-0 z-20 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-sm px-3 py-1 rounded">
                  {descriptions["Mealtime Engagement"]
                    ? descriptions["Mealtime Engagement"]
                    : "Empty"}
                </div>
              </div>
            </div>
            <div className="flex mt-4">
              <div
                data-label="Food Exposure"
                onClick={() => handleImageClick(8, "Food Exposure")}
                className="relative group cursor-pointer"
              >
                <img src="/FoodExposure.svg" alt="food" />
                <div className="tooltip absolute top-0 left-0 z-20 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-sm px-3 py-1 rounded">
                  {descriptions["Mealtime Engagement"]
                    ? descriptions["Food Exposure"]
                    : "Empty"}
                </div>
              </div>
              <div
                data-label="Mealtime Environment"
                onClick={() => handleImageClick(9, "Mealtime Environment")}
                className="relative group cursor-pointer"
              >
                <img src="/MealtimeEnvironment.svg" alt="food" />
                <div className="tooltip absolute top-0 left-0 z-20 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-sm px-3 py-1 rounded">
                  {descriptions["Mealtime Environment"]
                    ? descriptions["Mealtime Environment"]
                    : "Empty"}
                </div>
              </div>
              <div
                data-label="Flexibility"
                onClick={() => handleImageClick(10, "Flexibility")}
                className="relative group cursor-pointer"
              >
                <img src="/Flexibility.svg" alt="food" />
                <div className="tooltip absolute top-0 left-0 z-20 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-sm px-3 py-1 rounded">
                  {descriptions["Flexibility"]
                    ? descriptions["Flexibility"]
                    : "Empty"}
                </div>
              </div>
            </div>
            <div className="flex">
              <div
                className="relative group cursor-pointer"
                data-label="Hunger Cycle"
                onClick={() => handleImageClick(11, "Hunger Cycle")}
              >
                <img src="/HungerCycle.svg" alt="food" />
                <div className="tooltip absolute top-0 left-0 z-20 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-sm px-3 py-1 rounded">
                  {descriptions["Hunger Cycle"]
                    ? descriptions["Hunger Cycle"]
                    : "Empty"}
                </div>
              </div>
              <div
                data-label="Mealtime Roles"
                onClick={() => handleImageClick(12, "Mealtime Roles")}
                className="relative group cursor-pointer"
              >
                <img src="/MealtimeRoles.svg" alt="food" />
                <div className="tooltip absolute top-0 left-0 z-20 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-sm px-3 py-1 rounded">
                  {descriptions["Mealtime Roles"]
                    ? descriptions["Mealtime Roles"]
                    : "Empty"}
                </div>
              </div>
              <div
                data-label="Caregivers Influence"
                onClick={() => handleImageClick(13, "Caregivers Influence")}
                className="relative group cursor-pointer"
              >
                <img src="/CaregiversInfluence.svg" alt="food" />
                <div className="tooltip absolute top-0 left-0 z-20 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-sm px-3 py-1 rounded">
                  {descriptions["Caregivers Influence"]
                    ? descriptions["Caregivers Influence"]
                    : "Empty"}
                </div>
              </div>
              <div
                data-label="Calm Mealtimes"
                onClick={() => handleImageClick(14, "Calm Mealtimes")}
                className="relative group cursor-pointer"
              >
                <img src="/CalmMealtime.svg" alt="food" />
                <div className="tooltip absolute top-0 left-0 z-20 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-sm px-3 py-1 rounded">
                  {descriptions["Calm Mealtimes"]
                    ? descriptions["Calm Mealtimes"]
                    : "Empty"}
                </div>
              </div>
            </div>
            <div className="flex">
              <div
                data-label="Development"
                onClick={() => handleImageClick(15, "Development")}
                className="relative group cursor-pointer"
              >
                <img src="/Development.svg" alt="food" />
                <div className="tooltip absolute top-0 left-0 z-20 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-sm px-3 py-1 rounded">
                  {descriptions["Development"]
                    ? descriptions["Development"]
                    : "Empty"}
                </div>
              </div>
              <div
                data-label="Medical / Nutrition"
                onClick={() => handleImageClick(16, "Medical / Nutrition")}
                className="relative group cursor-pointer"
              >
                <img src="/MedicalNutrition.svg" alt="food" />
                <div className="tooltip absolute top-0 left-0 z-20 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-sm px-3 py-1 rounded">
                  {descriptions["Medical / Nutrition"]
                    ? descriptions["Medical / Nutrition"]
                    : "Empty"}
                </div>
              </div>
              <div
                data-label="Temperament"
                onClick={() => handleImageClick(17, "Temperament")}
                className="relative group cursor-pointer"
              >
                <img src="/Temperament.svg" alt="food" />
                <div className="tooltip absolute top-0 left-0 z-20 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-sm px-3 py-1 rounded">
                  {descriptions["Temperament"]
                    ? descriptions["Temperament"]
                    : "Empty"}
                </div>
              </div>
            </div>

            <button
              className="mt-8 w-[30%] rounded-full px-4 py-2 bg-custom-gradient text-white"
              onClick={handleNextClick}
            >
              {isLoading ? "Submitting...." : "Next"}
            </button>
          </div>
        </div>
      </section>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={handleCloseModal}>
              X
            </button>
            <h2 className="font-semibold py-3 text-lg border-black-1">
              {selectedSection?.label}
            </h2>
            <textarea
              value={descriptionInput}
              onChange={(e) => setDescriptionInput(e.target.value)}
              placeholder="Add Descriptions"
              className="w-full"
              rows={4}
              required
            />
            <div className="flex justify-center">
              <button
                className="bg-custom-gradient px-12 py-2 rounded-full text-white mt-6"
                onClick={handleAddDescription}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormulationPyramid;
