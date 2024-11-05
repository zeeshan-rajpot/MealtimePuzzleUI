import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { Link, useNavigate, useParams } from "react-router-dom";

const HistoryDetail = () => {
  const { urn } = useParams();
  const navigate = useNavigate();
  const [childData, setChildData] = useState(null);
  const [sessions, setSessions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `http://localhost:5001/api/get/Intervention/${urn}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched child data:", response.data);
        setChildData(response.data.childData);
        setSessions(response.data.data || {}); // Ensure sessions is an object
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [urn]);

  const handleBack = () => {
    navigate(-1);
  };

  const totalSessions = Object.keys(sessions).length; // Calculate total sessions

  return (
    <>
      <Header />
      <section className="flex flex-col lg:flex-row justify-between gap-4 h-auto w-full">
        <SideBar />
        <div className="pt-10 w-full lg:w-[75%] xl:w-[80%] 2xl:w-[85%] h-auto">
          <div className="flex mt-4 cursor-pointer" onClick={handleBack}>
            <img src="/ion_chevron-back.svg" alt="back_arrow" />
            <button className="text-base">Back</button>
          </div>

          <div className="flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold mb-4">
              {childData?.firstName} {childData?.lastName}
            </h2>
            <h2 className="text-xl font-bold mb-4">
              Total Sessions: {totalSessions}
            </h2>
            <div className="flex flex-wrap gap-4 mt-8 justify-center">
              {/* Render buttons for each session */}
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
          </div>
        </div>
      </section>
    </>
  );
};

export default HistoryDetail;
