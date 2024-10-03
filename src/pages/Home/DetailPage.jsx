import React, { useEffect, useState ,useRef} from "react";

import { useReactToPrint } from "react-to-print";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import "./print.css";

const DetailPage = () => {
  const { urn, session } = useParams();
  console.log(urn, session);

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  const printRef = useRef();

  // Function to handle printing
  const handlePrint = () => {
    const printableContent = printRef.current.innerHTML; // Get the HTML content of the div
    const originalContent = document.body.innerHTML;     // Store original body content

    document.body.innerHTML = printableContent;          // Replace body with the printable div
    window.print();                                      // Trigger the print
    document.body.innerHTML = originalContent;           // Restore original body content
    // window.location.reload();                            // Reload to restore event listeners
  };

  const [interventionData, setInterventionData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for the API call

  // Fetch intervention data from API
  useEffect(() => {
    const fetchInterventionData = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from local storage
        const response = await fetch(`http://localhost:5001/api/get/Intervention/${urn}/${session}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Add the token to the Authorization header
            'Content-Type': 'application/json', // Specify the content type if necessary
          },
        });

        const data = await response.json();
        console.log(data);
        setInterventionData(data);
      } catch (error) {
        console.error("Error fetching intervention data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterventionData();


    const intervalId = setInterval(fetchInterventionData, 2000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId)
  }, [urn, session]);


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

    return sortedStepperArray;
  };

  const sortedData = displaySortedData();
 

  const handleSave = () => {
    const token = localStorage.getItem("token");
    localStorage.clear();
    if (token) {
      localStorage.setItem("token", token);
    }
    navigate("/home");
  };

  console.log(interventionData)
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

          <div ref={printRef} id="printableContent" className="w-full max-w-3xl mx-auto pb-12">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-semibold ">Child Information</h2>
              <h2 className="text-2xl font-semibold ">
                Session {interventionData?.sessionNumber}
              </h2>
            </div>

            {loading ? (
              <p>Loading intervention data...</p>
            ) : (
              <div className="mt-4 space-y-6">
                <p className="text-sm font-medium">Child's URN(Unit Record Number)</p>
                <p className="border-b-2">{urn}</p>
                <p className="text-sm font-medium ">Child First Name:</p>
                <p className="border-b-2 py-1">{interventionData?.child?.firstName || "firstname"}</p>
                <p className="text-sm font-medium">Child Last Name:</p>
                <p className="border-b-2 ">{interventionData?.child?.lastName || "not found"}</p>
                <p className="text-sm font-medium">Parent/Caretaker Name:</p>
                <p className="border-b-2 ">{interventionData?.child?.parentName || "not found"}</p>
                <p className="text-sm font-medium">Date of Birth:</p>
                <p className="border-b-2 ">{interventionData?.child?.dateOfBirth || "not found"}</p>

                <p className="text-sm font-medium">Email:</p>
                <p className="border-b-2 ">{interventionData?.child?.contactEmail || "not found"}</p>
                <p className="text-sm font-medium">Contact Number:</p>
                <p className="border-b-2 ">{interventionData?.child?.contactPhone || "not found"}</p>
              </div>
            )}

            <div className="mt-10">
              <h2 className="text-2xl font-semibold ">Mealtime</h2>

              {loading ? null : (
                interventionData?.sessionEntries?.map((step, index) => (
                  <div key={index} className="space-y-6">
                    <h3 className="mt-8 text-lg font-semibold">{step.domainname}</h3>
                    <p className="text-sm font-medium">Clinical Prompt: </p>
                    <p className="border-b-2 ">{step.clinicalPrompt || "not found"}</p>  
                      <p className="text-sm font-medium">Formulation : </p>
                    <p className="border-b-2 ">{step.formulation || "not found"}</p>
                    <p className="text-sm font-medium">Recommendation: </p>
                    <p className="border-b-2 ">{step.recommendation || "not found"}</p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-10 flex justify-center space-x-4">
              <button
              onClick={handlePrint}
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
