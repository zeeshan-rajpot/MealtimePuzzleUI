import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { useNavigate, useParams } from "react-router-dom";

const HistoryDetail = () => {
  const { urn } = useParams();
  const navigate = useNavigate();
  const [childData, setChildData] = useState(null);
  // const [sessionData, setSessionData] = useState(null);
  // const [selectedSession, setSelectedSession] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `http://localhost:5001/child/${urn}/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setChildData(response.data);
        console.log(response.data);

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

          <div className="w-full max-w-3xl mx-auto pb-12">

            {childData?.childHistory ? (
              <img src={childData.childHistory} alt={childData.urn} />
            ) : (
              <p className="flex justify-center items-center font-semibold text-2xl">No Child History</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default HistoryDetail;
