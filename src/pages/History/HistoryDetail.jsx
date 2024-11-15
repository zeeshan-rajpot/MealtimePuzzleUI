import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { Link, useNavigate, useParams } from "react-router-dom";

const HistoryDetail = () => {
  // Access the URN parameter from the URL
  const { urn } = useParams();
  const navigate = useNavigate();

  // State for child data and session data
  const [childData, setChildData] = useState(null);
  const [sessions, setSessions] = useState({});

  // Fetch child and session data when component mounts or when URN changes
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token"); // Retrieve token for authentication
      try {
        const response = await axios.get(
          `http://localhost:5001/api/get/Intervention/${urn}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Set child and session data
        setChildData(response.data.childData);
        setSessions(response.data.data || {}); // Ensure sessions is an object
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [urn]);

  // Handler to navigate back to the previous page
  const handleBack = () => {
    navigate(-1);
  };

  // Calculate the total number of sessions
  const totalSessions = Object.keys(sessions).length;

  return (
    <>
      <Header />
      <section className="flex flex-col lg:flex-row justify-between gap-4 h-auto w-full">
        <SideBar />
        <div className="pt-10 w-full lg:w-[75%] xl:w-[80%] 2xl:w-[85%] h-auto">
          {/* Back button */}
          <div className="flex mt-4 cursor-pointer" onClick={handleBack}>
            <img src="/ion_chevron-back.svg" alt="back_arrow" />
            <button className="text-base">Back</button>
          </div>

          {/* Display child name and total session count */}
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold mb-4">
              {childData?.firstName} {childData?.lastName}
            </h2>
            <h2 className="text-xl font-bold mb-4">
              Total Sessions: {totalSessions}
            </h2>

            {/* Render buttons for each session */}
            <div className="flex flex-wrap gap-4 mt-8 justify-center">
              {Object.keys(sessions).map((sessionKey, index) => {
                const sessionNumber = sessionKey.match(/\d+/)?.[0]; // Extract digits only
                return (
                  <Link key={index} to={`/history/sessiondetails/${urn}/${sessionNumber}`}>
                    <button className="py-2 px-6 bg-ceruleanBlue text-white rounded-full shadow-md hover:bg-blushPink transition duration-300 text-sm">
                      View Session {sessionNumber}
                    </button>
                  </Link>
                );
              })}
            </div>
            {/* View All Sessions Button */}
            <Link to={`/history/all-sessions/${urn}`} className="mt-8">
  <button className="py-2 px-8 bg-ceruleanBlue text-white rounded-full shadow-md hover:bg-blushPink transition duration-300 text-sm">
    View All Sessions
  </button>
</Link>

          </div>
        </div>
      </section>
    </>
  );
};

export default HistoryDetail;
