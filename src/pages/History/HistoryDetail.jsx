import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { useNavigate, useParams } from "react-router-dom";

const HistoryDetail = () => {
  const { urn } = useParams();
  const navigate = useNavigate();
  const [childData, setChildData] = useState(null);
  const [sessionData, setSessionData] = useState(null);

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
        setChildData(response.data.childData);
        setSessionData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [urn]);

  const handleBack = () => {
    navigate(-1);
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
              <h2 className="text-2xl font-semibold">Child Information</h2>
            </div>

            {childData && (
              <div className="mt-4 space-y-6">
                <p className="text-sm font-medium">
                  Child's URN (Unit Record Number):
                </p>
                <p className="border-b-2">{childData.urn}</p>
                <p className="text-sm font-medium">Child First Name:</p>
                <p className="border-b-2 py-1">{childData.firstName}</p>
                <p className="text-sm font-medium">Child Last Name:</p>
                <p className="border-b-2 ">{childData.lastName}</p>
                <p className="text-sm font-medium">Parent/Caretaker Name:</p>
                <p className="border-b-2 ">{childData.parentName}</p>
                <p className="text-sm font-medium">Date of Birth:</p>
                <p className="border-b-2 ">
                  {new Date(childData.dateOfBirth).toLocaleDateString()}
                </p>
                <p className="text-sm font-medium">Email:</p>
                <p className="border-b-2 ">{childData.contactEmail}</p>
                <p className="text-sm font-medium">Contact Number:</p>
                <p className="border-b-2 ">{childData.contactPhone}</p>
                <p className="text-sm font-medium">FIN Number:</p>
                <p className="border-b-2 ">{childData.finnumber}</p>
              </div>
            )}

            <div className="mt-10">
              <h2 className="text-2xl font-semibold">Mealtime</h2>
              {sessionData &&
                Object.keys(sessionData).map((sessionKey) => (
                  <div key={sessionKey}>
                    <h3 className="text-xl font-semibold my-3">{sessionKey}</h3>
                    {sessionData[sessionKey].map((intervention, index) => (
                      <div key={index}>
                        <h3 className=" text-lg font-semibold mb-2">
                          {intervention.domainname}
                        </h3>
                        <p className="text-sm font-medium mb-1">
                          Clinical Prompt:
                        </p>
                        <p className="border-b-2 mb-3">
                          {intervention.clinicalPrompt}
                        </p>
                        <p className="text-sm font-medium mb-1">
                          Recommendation:
                        </p>
                        <p className="border-b-2 mb-3">
                          {intervention.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HistoryDetail;