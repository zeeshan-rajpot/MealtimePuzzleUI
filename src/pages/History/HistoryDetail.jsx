import React, { useEffect, useState } from "react";
import axios from "axios";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { useNavigate, useParams } from "react-router-dom";

const HistoryDetail = () => {
  const { urn } = useParams();
  const navigate = useNavigate();
  const [childData, setChildData] = useState(null);
  const [session, setSession] = useState(null);

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
        setSession(response.data.data);
        console.log("Fetched child history:", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [urn]);

  const handleBack = () => {
    navigate(-1);
  };

  // Function to generate and download Word document
  const downloadWordDocument = () => {
    const zip = new PizZip();
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    // Generate document content
    const docContent = {
      childName: `${childData?.firstName || ""} ${childData?.lastName || ""}`,
      urn: childData?.urn || "",
      sessions: Object.entries(session || {}).map(([sessionKey, sessionValue]) => ({
        sessionKey,
        interventions: sessionValue.interventions.map(intervention => ({
          domainName: intervention.domainName,
          clinicalPrompt: intervention.clinicalPrompt,
          priority: intervention.priority,
          formulation: intervention.formulation,
          recommendation: intervention.recommendation
        })),
        childHistory: sessionValue.childHistory || "N/A",
        reportRecommendation: sessionValue.reportRecommendation || "N/A"
      }))
    };

    doc.setData(docContent);

    try {
      doc.render();
      const blob = doc.getZip().generate({ type: "blob" });
      saveAs(blob, `Child_History_${childData?.firstName}_${childData?.lastName}.docx`);
    } catch (error) {
      console.error("Error creating document:", error);
    }
  };

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

          <div className="flex items-center justify-center mx-auto ">
            <h2 className="me-2 text-2xl">Child Name : {childData?.firstName}</h2>
            <h2 className="text-2xl">{childData?.lastName}</h2>
          </div>
          <h2 className="text-2xl text-center">URN : {childData?.urn}</h2>

          <div className="p-4 space-y-6 mt-12">
            <div className="flex justify-between w-full">
              <h2 className="bg-black text-white text-lg font-normal ps-2 w-full text-left">
                CDS MEALTIME PUZZLE SUMMARY
              </h2>
            </div>
            {Object.entries(session || {}).map(([sessionKey, sessionValue], index) => (
              <div key={index}>
                <h2 className="text-2xl">{sessionKey}</h2>
                <div className="interventions">
                  {sessionValue.interventions.map((intervention, i) => (
                    <div key={i} className="intervention-item">
                      <h3 className="font-semibold text-xl my-3">Domain: {intervention.domainName}</h3>
                      <p><strong>Clinical Prompt:</strong> {intervention.clinicalPrompt}</p>
                      <p className="font-normal text-lg"><strong>Priority:</strong> {intervention.priority}</p>
                      <p className="font-normal text-lg"><strong>Formulation:</strong> {intervention.formulation}</p>
                      <p className="font-normal text-lg"><strong>Recommendation:</strong> {intervention.recommendation}</p>
                    </div>
                  ))}
                </div>
            
              </div>
            ))}
          </div>

          {/* <button onClick={downloadWordDocument} className="btn btn-primary mt-4">
            Download as Word Document
          </button> */}
        </div>
      </section>
    </>
  );
};

export default HistoryDetail;
