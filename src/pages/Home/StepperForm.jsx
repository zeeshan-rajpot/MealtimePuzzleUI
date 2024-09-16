import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { useNavigate } from "react-router-dom";

const StepperForm = () => {
  const navigate = useNavigate();
  // Retrieve categories from local storage
  const savedCategories =
    JSON.parse(localStorage.getItem("selectedImageLabels")) || [];

  // Track the current step
  const [currentStep, setCurrentStep] = useState(0);

  // Track form input values for each step
  const [formData, setFormData] = useState({
    role: "",
    clinicalPrompt: "",
    impression: "",
    recommendation: "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Move to the next step
  const handleNext = () => {
    if (currentStep < savedCategories.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Move to the previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle form submission (for now, log the data to the console)
  const handleSubmit = () => {
    navigate("/home/childinfo");
  };

  return (
    <>
      <Header />
      <section className="flex flex-col lg:flex-row justify-between gap-4 h-auto w-full">
        <SideBar />
        <div className="pt-10 w-full lg:w-[75%] xl:w-[80%] 2xl:w-[85%] h-auto">
          <div
            className="flex mt-4"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <img src="/ion_chevron-back.svg" alt="back_arrow" />
            <button className="text-base">Back</button>
          </div>
          <div className="w-full max-w-3xl mx-auto flex justify-center items-center flex-col">
            <h2 className="text-2xl font-semibold">
              Step {currentStep + 1}: {savedCategories[currentStep]}
            </h2>

            <div className="w-full mt-4 ">
              <select
                className="w-full p-3 border rounded mb-4"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="">Select your role</option>
                <option value="Doctor">Doctor</option>
                <option value="Nutritionist">Nutritionist</option>
                <option value="Caregiver">Caregiver</option>
              </select>

              <input
                type="text"
                name="clinicalPrompt"
                placeholder="Enter Clinical Prompt"
                className="w-full p-3 border rounded mb-4"
                value={formData.clinicalPrompt}
                onChange={handleInputChange}
              />

              <input
                type="text"
                name="impression"
                placeholder="Enter Impression"
                className="w-full p-3 border rounded mb-4"
                value={formData.impression}
                onChange={handleInputChange}
              />

              <input
                type="text"
                name="recommendation"
                placeholder="Enter Recommendation"
                className="w-full p-3 border rounded mb-4"
                value={formData.recommendation}
                onChange={handleInputChange}
              />

              <div className="flex justify-center mt-4">
                {currentStep === savedCategories.length - 1 ? (
                  <button
                    className="bg-primary text-white rounded-full py-3 px-32 "
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    className="bg-primary text-white rounded-full py-3 px-32"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StepperForm;
