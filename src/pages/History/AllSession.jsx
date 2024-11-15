import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import generateWordReport from "../../pages/History/generateWordReport"; // Ensure this path is correct

const AllSessions = () => {
  const { urn } = useParams();
  const navigate = useNavigate();
  const [sessionsData, setSessionsData] = useState([]);
  const [childData, setChildData] = useState({});
  const [sortOrder, setSortOrder] = useState("desc"); // State for sorting order
  const token = localStorage.getItem("token");

  // Fetch all sessions with order parameter
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        console.log("Fetching sessions data with order:", sortOrder);

        const response = await axios.get(
          `http://localhost:5001/api/get/Intervention/${urn}?order=${sortOrder}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Response from API:", response.data);

        // Set child information
        setChildData(response.data.childData);

        // Extract and sort session data
        const sessionEntries = Object.entries(response.data.data || {})
          .sort(([aKey], [bKey]) => {
            // Sort session keys by session number
            const aNum = parseInt(aKey.replace("session ", ""), 10);
            const bNum = parseInt(bKey.replace("session ", ""), 10);
            return sortOrder === "asc" ? aNum - bNum : bNum - aNum;
          })
          .map(([sessionKey, sessionValue]) => ({
            sessionNumber: sessionKey.replace("session ", ""),
            highPriority: sessionValue.interventions.filter(
              (intervention) => intervention.priority.toLowerCase() === "high"
            ),
            moderatePriority: sessionValue.interventions.filter(
              (intervention) => intervention.priority.toLowerCase() === "moderate"
            ),
            lowPriority: sessionValue.interventions.filter(
              (intervention) => intervention.priority.toLowerCase() === "low"
            ),
          }));

        setSessionsData(sessionEntries);
      } catch (error) {
        console.error("Error fetching all sessions:", error);
      }
    };

    fetchSessions();
  }, [urn, sortOrder]);

  // Toggle sorting order
  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "desc" ? "asc" : "desc"));
    console.log("Sort order toggled to:", sortOrder === "desc" ? "asc" : "desc");
  };

  return (
    <>
      <Header />
      <section className="flex flex-col lg:flex-row justify-between gap-4 h-auto w-full">
        <SideBar />
        <div className="pt-10 w-full lg:w-[75%] xl:w-[80%] 2xl:w-[85%] h-auto">
          <button onClick={() => navigate(-1)} className="text-base mb-4">
            Back
          </button>

          {/* Display Child Name and URN */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-semibold">{childData?.firstName} {childData?.lastName}</h2>
            <h3 className="text-xl text-gray-500">URN: {childData?.urn}</h3>
          </div>

          {/* Sort Toggle Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={toggleSortOrder}
              className="px-6 py-3 bg-gray-600 text-white rounded-full shadow-md hover:bg-gray-700 transition duration-300"
            >
              Sort {sortOrder === "desc" ? "Ascending" : "Descending"}
            </button>
          </div>

          <div className="flex flex-col items-start gap-6">
            {sessionsData.length > 0 ? (
              sessionsData.map((session, index) => (
                <div
                  key={index}
                  className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md mb-8"
                >
                  <h3 className="text-2xl font-bold mb-4">Session {session.sessionNumber}</h3>

                  {/* High Priority Domains */}
                  {session.highPriority.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-xl font-semibold mb-3 text-green-600">High Priority Domains</h4>
                      {session.highPriority.map((entry, entryIndex) => (
                        <div key={entryIndex} className="mb-4">
                          <h5 className="font-semibold text-lg">{entry.domainName}</h5>
                          <p><strong>Clinical Prompt:</strong> {entry.clinicalPrompt || "N/A"}</p>
                          <p><strong>Formulation:</strong> {entry.formulation || "N/A"}</p>
                          <p><strong>Recommendation:</strong> {entry.recommendation || "N/A"}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Moderate Priority Domains */}
                  {session.moderatePriority.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-xl font-semibold mb-3 text-yellow-600">Moderate Priority Domains</h4>
                      {session.moderatePriority.map((entry, entryIndex) => (
                        <div key={entryIndex} className="mb-4">
                          <h5 className="font-semibold text-lg">{entry.domainName}</h5>
                          <p><strong>Clinical Prompt:</strong> {entry.clinicalPrompt || "N/A"}</p>
                          <p><strong>Formulation:</strong> {entry.formulation || "N/A"}</p>
                          <p><strong>Recommendation:</strong> {entry.recommendation || "N/A"}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Low Priority Domains (Other Domains) */}
                  {session.lowPriority.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-xl font-semibold mb-3 text-blue-600">Other Domains</h4>
                      {session.lowPriority.map((entry, entryIndex) => (
                        <div key={entryIndex} className="mb-4">
                          <h5 className="font-semibold text-lg">{entry.domainName}</h5>
                          <p><strong>Clinical Prompt:</strong> {entry.clinicalPrompt || "N/A"}</p>
                          <p><strong>Formulation:</strong> {entry.formulation || "N/A"}</p>
                          <p><strong>Recommendation:</strong> {entry.recommendation || "N/A"}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Download Button */}
                  <button
                    onClick={() => generateWordReport(session, session.sessionNumber, earliest, latest)}
                    className="mt-6 px-6 py-3 bg-ceruleanBlue text-white rounded-full shadow-md hover:bg-blushPink transition duration-300"
                  >
                    Download Session {session.sessionNumber} Summary
                  </button>
                </div>
              ))
            ) : (
              <p>No session data available.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default AllSessions;
