import React, { useState, useEffect } from "react";

const StepperForm = () => {
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
    console.log("Form submitted with data:", formData);
    // You can redirect or process the form data further here
  };

  return (
    <div className="w-full flex justify-center items-center flex-col">
      <h2 className="text-2xl font-semibold">
        Step {currentStep + 1}: {savedCategories[currentStep]}
      </h2>

      <div className="w-full mt-4">
        <select
          className="w-full p-2 border rounded mb-4"
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
          className="w-full p-2 border rounded mb-4"
          value={formData.clinicalPrompt}
          onChange={handleInputChange}
        />

        <input
          type="text"
          name="impression"
          placeholder="Enter Impression"
          className="w-full p-2 border rounded mb-4"
          value={formData.impression}
          onChange={handleInputChange}
        />

        <input
          type="text"
          name="recommendation"
          placeholder="Enter Recommendation"
          className="w-full p-2 border rounded mb-4"
          value={formData.recommendation}
          onChange={handleInputChange}
        />

        <div className="flex justify-between mt-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </button>

          {currentStep === savedCategories.length - 1 ? (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleSubmit}
            >
              Submit
            </button>
          ) : (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleNext}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepperForm;
