import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { useNavigate } from "react-router-dom";
import "./print.css";

const DetailPage = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    useNavigate(-1);
  };
  const [childInfo, setChildInfo] = useState(null);

  useEffect(() => {
    const storedChildInfo = JSON.parse(localStorage.getItem("childData")) || {};
    setChildInfo(storedChildInfo);
  }, []);

  const displayDataOrFallback = (field) => {
    return childInfo && childInfo[field] ? childInfo[field] : "not found";
  };

  const displaySortedData = () => {
    const stepperInfo = JSON.parse(localStorage.getItem("stepperInfo")) || {};

    const priorityMap = {
      high: 3,
      moderate: 2,
      low: 1,
    };

    const stepperArray = Object.keys(stepperInfo).map((key) => ({
      id: key,
      ...stepperInfo[key],
      priorityValue: priorityMap[stepperInfo[key].priority] || 0,
    }));

    // Sort the array by priorityValue in descending order
    const sortedStepperArray = stepperArray.sort(
      (a, b) => b.priorityValue - a.priorityValue
    );

    // Display the sorted data
    // console.log("Sorted data based on priority:", sortedStepperArray);

    return sortedStepperArray;
  };

  // Call this function where you need to display or use the sorted data
  const sortedData = displaySortedData();

  let sessionNumber = localStorage.getItem("session");

  const handleSave = () => {
    const token = localStorage.getItem("token");
    localStorage.clear();
    if (token) {
      localStorage.setItem("token", token);
    }
    navigate("/home");
  };

  return (
    <>
      <Header />
      <section className="flex flex-col lg:flex-row justify-between gap-4 h-auto w-full">
        <SideBar />
        <div className="pt-10 w-full lg:w-[75%] xl:w-[80%] 2xl:w-[85%] h-auto">
          <div className="flex mt-4" onClick={handleBack}>
            <img src="/ion_chevron-back.svg" alt="back_arrow" />
            <button className="text-base">Back</button>
          </div>

          <div id="printableContent" className="w-full max-w-3xl mx-auto pb-12">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-semibold ">Child Information</h2>
              <h2 className="text-2xl font-semibold ">
                {" "}
                Session {sessionNumber ? sessionNumber : "1"}
              </h2>
            </div>

            <div className="mt-4 space-y-6">
              <p className="text-sm font-medium">
                Child's URN(Unit Record Number)
              </p>
              <p className="border-b-2">{displayDataOrFallback("urn")}</p>
              <p className="text-sm font-medium ">Child First Name:</p>
              <p className="border-b-2 py-1">
                {displayDataOrFallback("firstName")}
              </p>
              <p className="text-sm font-medium">Child Last Name:</p>
              <p className="border-b-2 ">{displayDataOrFallback("lastName")}</p>
              <p className="text-sm font-medium">Parent/Caretaker Name:</p>
              <p className="border-b-2 ">
                {displayDataOrFallback("parentName")}
              </p>
              <p className="text-sm font-medium">Date of Birth:</p>
              <p className="border-b-2 ">
                {displayDataOrFallback("dateOfBirth")}
              </p>

              <p className="text-sm font-medium">Email:</p>
              <p className="border-b-2 ">
                {displayDataOrFallback("contactEmail")}
              </p>
              <p className="text-sm font-medium">Contact Number:</p>
              <p className="border-b-2 ">
                {displayDataOrFallback("contactPhone")}
              </p>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-semibold ">Mealtime</h2>

              {sortedData.map((step, index) => (
                <div key={index} className="space-y-6">
                  <h3 className="mt-8 text-lg font-semibold">{step.label}</h3>
                  {/* <p>Role: {step.role || "not found"}</p> */}
                  <p className="text-sm font-medium">Clinical Prompt: </p>
                  <p className="border-b-2 ">
                    {step.clinicalPrompt || "not found"}
                  </p>
                  {/* <p className="text-sm font-medium">Impression: </p>
                  <p className="border-b-2 ">
                    {step.impression || "not found"}
                  </p> */}
                  <p className="text-sm font-medium">Recommendation: </p>
                  <p className="border-b-2 ">
                    {step.recommendation || "not found"}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center space-x-4">
              <button
                className="bg-custom-gradient text-white px-32 py-2 rounded-full"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                // onClick={handlePrint}
                className="border-2 border-primary text-primary px-28 py-2 rounded-full flex"
              >
                <img src="/lets-icons_print-duotone.svg" alt="print" />
                Print
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DetailPage;
