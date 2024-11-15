import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import generateWordReport from "../../pages/History/generateWordReport"; // Ensure this path is correct

const SessionDetail = () => {
  // Retrieve parameters from URL
  const { urn, session } = useParams();
  const navigate = useNavigate();

  // State to hold session data
  const [sessionData, setSessionData] = useState(null);

  // Fetch session data on component mount or when URL parameters change
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token"); // Retrieve token for authorization
      try {
        const response = await axios.get(
          `http://localhost:5001/api/get/Intervention/${urn}/${session}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSessionData(response.data); // Set session data after fetching
      } catch (error) {
        console.error("Error fetching session data:", error);
        if (error.response) {
          console.error("Error response data:", error.response.data);
        }
      }
    };

    fetchData();
  }, [urn, session]);

  // Calculate the earliest creation and latest update dates in the session
  const getSummaryDates = () => {
    if (!sessionData || !sessionData.sessionEntries) return { earliest: null, latest: null };

    const dates = sessionData.sessionEntries.map(entry => ({
      createdAt: new Date(entry.createdAt),
      updatedAt: new Date(entry.updatedAt),
    }));

    const earliest = new Date(Math.min(...dates.map(d => d.createdAt)));
    const latest = new Date(Math.max(...dates.map(d => d.updatedAt)));

    return { earliest, latest };
  };

  const { earliest, latest } = getSummaryDates();

  // Filter session entries by priority level
  const highPriorityEntries = sessionData?.sessionEntries.filter(entry => entry.priority.toLowerCase() === "high") || [];
  const moderatePriorityEntries = sessionData?.sessionEntries.filter(entry => entry.priority.toLowerCase() === "moderate") || [];
  const otherEntries = sessionData?.sessionEntries.filter(entry => entry.priority.toLowerCase() === "low") || [];

  return (
    <>
      <Header />
      <section className="flex flex-col lg:flex-row justify-between gap-4 h-auto w-full">
        <SideBar />
        <div className="pt-10 w-full lg:w-[75%] xl:w-[80%] 2xl:w-[85%] h-auto">
          {/* Back button */}
          <button onClick={() => navigate(-1)} className="text-base mb-4">
            Back
          </button>

          {/* Session Header */}
          <h2 className="text-2xl text-center mb-4">Session: {session}</h2>

          {/* Display summary dates if available */}
          {earliest && latest && (
            <div className="text-center mb-4">
              <p><strong>Session Start Date:</strong> {earliest.toLocaleDateString()}</p>
              <p><strong>Last Updated:</strong> {latest.toLocaleDateString()}</p>
            </div>
          )}

          {sessionData ? (
            <div>
              {/* Child Information */}
              <h3 className="font-semibold text-xl mb-4">Child Information</h3>
              <p><strong>Name:</strong> {sessionData.child?.firstName} {sessionData.child?.lastName}</p>
              <p><strong>URN:</strong> {sessionData.child?.urn}</p>

              {/* High Priority Domains */}
              {highPriorityEntries.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-xl mt-6 mb-4 text-green-600">High Priority Domains</h3>
                  {highPriorityEntries.map((entry, index) => (
                    <div key={index} className="mb-4">
                      <h4 className="font-semibold text-lg">{entry.domainname}</h4>
                      <p><strong>Clinical Prompt:</strong> {entry.clinicalPrompt || "No clinical prompt provided."}</p>
                      <p><strong>Formulation:</strong> {entry.formulation || "No formulation provided."}</p>
                      <p><strong>Recommendation:</strong> {entry.recommendation || "No recommendation provided."}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Moderate Priority Domains */}
              {moderatePriorityEntries.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-xl mt-6 mb-4 text-yellow-600">Moderate Priority Domains</h3>
                  {moderatePriorityEntries.map((entry, index) => (
                    <div key={index} className="mb-4">
                      <h4 className="font-semibold text-lg">{entry.domainname}</h4>
                      <p><strong>Clinical Prompt:</strong> {entry.clinicalPrompt || "No clinical prompt provided."}</p>
                      <p><strong>Formulation:</strong> {entry.formulation || "No formulation provided."}</p>
                      <p><strong>Recommendation:</strong> {entry.recommendation || "No recommendation provided."}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Other Domains */}
              {otherEntries.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-xl mt-6 mb-4 text-blue-600">Other Domains</h3>
                  {otherEntries.map((entry, index) => (
                    <div key={index} className="mb-4">
                      <h4 className="font-semibold text-lg">{entry.domainname}</h4>
                      <p><strong>Clinical Prompt:</strong> {entry.clinicalPrompt || "No clinical prompt provided."}</p>
                      <p><strong>Formulation:</strong> {entry.formulation || "No formulation provided."}</p>
                      <p><strong>Recommendation:</strong> {entry.recommendation || "No recommendation provided."}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Download Button */}
              <button
                onClick={() => generateWordReport(sessionData, session, earliest, latest)}
                className="mt-6 px-6 py-3 bg-ceruleanBlue text-white rounded-full shadow-md hover:bg-blushPink transition duration-300"
              >
                Download Session Summary
              </button>
            </div>
          ) : (
            <p>Loading session details...</p>
          )}
        </div>
      </section>
    </>
  );
};

export default SessionDetail;
