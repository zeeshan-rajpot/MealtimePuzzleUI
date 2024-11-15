import React, { useEffect, useState, useRef, useCallback } from "react";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import './print.css';
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import axios from 'axios';

const DetailPage = () => {
  const { urn, session } = useParams();
  const reportRef = useRef(null);
  const [childData, setChildData] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [accessors, setAccessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [additionalInfo, setAdditionalInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5001/api/get/Intervention/${urn}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.data) {
          setChildData(response.data.childData || {});
          const sessionKey = `session ${session}`;
          setSessionData(response.data.data[sessionKey] || {});
        } else {
          console.log("No data available in response.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
  
      // Set accessors and additional information from localStorage
      const storedAccessors = JSON.parse(localStorage.getItem('accessors')) || [];
      setAccessors(storedAccessors);
      const storedAdditionalInfo = JSON.parse(localStorage.getItem('additionalInfo')) || {};
      setAdditionalInfo(storedAdditionalInfo);
    };
  
    fetchData();
  }, [urn, session]);
  

  function calculateAge(birthDate, appointmentDate) {
    let years = appointmentDate.getFullYear() - birthDate.getFullYear();
    let months = appointmentDate.getMonth() - birthDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years} year(s), ${months} month(s)`;
  }

  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: `${childData?.firstName}_${childData?.lastName}_Report`,
  });

  
  const handleDownloadPDF = () => {
    const options = {
      margin: 1,
      filename: `${childData?.firstName}_${childData?.lastName}_Report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' }
    };
    html2pdf().from(reportRef.current).set(options).save();
  };

  const priorityOrder = { high: 1, moderate: 2, low: 3 };

  const sortedInterventions = sessionData?.interventions?.slice().sort((a, b) => {
    return (priorityOrder[a.priority?.toLowerCase()] || 4) - (priorityOrder[b.priority?.toLowerCase()] || 4);
  });

  const groupedInterventions = sortedInterventions?.reduce((acc, intervention) => {
    const priority = intervention.priority?.toLowerCase();
    if (!acc[priority]) acc[priority] = [];
    acc[priority].push(intervention);
    return acc;
  }, {});

  return (
    <>
      <Header />
      <section className="flex flex-col lg:flex-row justify-between gap-4 h-auto w-full font-meta">
        <SideBar />
        <div className="pt-10 w-full h-auto">
          <div className="w-full max-w-3xl mx-auto mb-20 bg-white p-8" ref={reportRef}>
            {/* Logos at the top */}
            <div className="flex justify-between items-center mb-4">
              <img src="/logo.PNG" alt="Logo 1" className="h-12" />
              <img src="/GCH Logo.png" alt="Logo 2" className="h-20 w-48" />
            </div>

            {/* Header with Child's Full Name and URN only in PDF */}
            <div className="pdf-header pdf-only">
              {childData?.firstName} {childData?.lastName} {urn}
            </div>

            <div className="text-center mt-4">
              <h1 className="text-2xl font-bold">CDS MEALTIME CLINICAL REPORT</h1>
              <p className="text-lg font-semibold">Child Development Service (CDS)</p>
              <p className="text-base font-normal">Facility: Southport Health Precinct</p>
            </div>

            <div className="flex justify-between items-center mb-4">
  <div>
    <p><strong>Parent/Carer Name:</strong> {childData?.parentName || "N/A"}</p>
  </div>
</div>

<div className="mt-8">
  <table className="w-full max-w-3xl mx-auto border border-gray-300">
    <tbody>
      <tr>
        <td className="border p-2 font-semibold">Patient Name:</td>
        <td className="border p-2">{childData?.firstName || "First Name"} {childData?.lastName || "Last Name"}</td>
      </tr>
      <tr>
        <td className="border p-2 font-semibold">Date of Birth:</td>
        <td className="border p-2">{new Date(childData?.dateOfBirth).toLocaleDateString() || "N/A"}</td>
      </tr>
                  <tr>
                    <td className="border p-2 font-semibold">Age:</td>
                    <td className="border p-2">{childData?.dateOfBirth ? calculateAge(new Date(childData.dateOfBirth), new Date()) : "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-semibold">Sex:</td>
                    <td className="border p-2">{childData?.gender ? (childData.gender.charAt(0).toUpperCase() + childData.gender.slice(1)) : "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-semibold">FIN Number:</td>
                    <td className="border p-2">{childData?.finnumber || "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-semibold">Date of Report:</td>
                    <td className="border p-2">{new Date().toLocaleDateString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Multi-disciplinary Team Section */}
            <div className="mt-12">
              <p className="text-lg font-normal">
                {childData?.firstName} {childData?.lastName} attended for evaluation by the multi-disciplinary team consisting of:
              </p>
              <table className="w-full max-w-3xl mx-auto mt-8">
                {accessors.length > 0 ? (
                  <tbody>
                    {accessors.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="text-lg font-normal p-4 text-center">{item.username || '[Name]'}</td>
                        <td className="text-lg font-normal p-4 text-center">{item.role || '[Role]'}</td>
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan="2" className="text-lg font-normal text-center p-4">
                        No data found
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>

            <div className="mt-16">
              <p className="bg-black text-white text-lg font-normal p-2">BACKGROUND INFORMATION:</p>
              <p className="mt-4 px-2">{childData?.childHistory || "No background information available."}</p>
            </div>

            <div className="mt-12">
              <p className="bg-black text-white text-lg font-normal p-2">CDS MEALTIME PUZZLE SUMMARY</p>

              <div className="text-center my-6">
                <img src="/pyramid2.png" alt="Puzzle Logo" className="puzzle-image" />
                <p className="mt-4 text-center">
                  The Mealtime Puzzle is a clinical tool developed within the Child Development Service, that provides a summary of the factors that may impact on a child’s ability to engage in mealtimes. Below is a summary of the key areas relating to {childData?.firstName} {childData?.lastName} Mealtime Puzzle.
                </p>
              </div>

              <div className="mt-4">
                {groupedInterventions?.high && (
                  <div>
                    <h3 className="text-xl font-bold mt-6">High Priority Domains</h3>
                    {groupedInterventions.high.map((intervention, index) => (
                      <div key={index} className="p-4 border-b break-inside-avoid">
                        <h3 className="font-semibold text-xl">{intervention.domainName}</h3>
                        {intervention.formulation && <p><strong>Formulation:</strong> {intervention.formulation}</p>}
                        {intervention.recommendation && <p><strong>Recommendation:</strong> {intervention.recommendation}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {groupedInterventions?.moderate && (
                  <div>
                    <h3 className="text-xl font-bold mt-6">Moderate Priority Domains</h3>
                    {groupedInterventions.moderate.map((intervention, index) => (
                      <div key={index} className="p-4 border-b break-inside-avoid">
                        <h3 className="font-semibold text-xl">{intervention.domainName}</h3>
                        {intervention.formulation && <p><strong>Formulation:</strong> {intervention.formulation}</p>}
                        {intervention.recommendation && <p><strong>Recommendation:</strong> {intervention.recommendation}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {groupedInterventions?.low && (
                  <div>
                    <h3 className="text-xl font-bold mt-6">Other Domains</h3>
                    {groupedInterventions.low.map((intervention, index) => (
                      <div key={index} className="p-4 border-b break-inside-avoid">
                        <h3 className="font-semibold text-xl">{intervention.domainName}</h3>
                        {intervention.formulation && <p><strong>Formulation:</strong> {intervention.formulation}</p>}
                        {intervention.recommendation && <p><strong>Recommendation:</strong> {intervention.recommendation}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-16">
              <p className="bg-black text-white text-lg font-normal p-2">RECOMMENDATION:</p>
              <p className="mt-4 px-2">{childData?.RecommendationChild || "No recommendations available."}</p>
            </div>

            <hr className="my-8 border-gray-400" />

            <div className="flex items-start mt-6 px-2 break-inside-avoid">
              <img src="/qr.PNG" alt="QR Code" className="w-20 h-auto mr-4" />
              <div>
                <h3 className="font-bold">Office</h3>
                <p>Child Development Service</p>
                <p>Level 3, Southport Health Precinct</p>
                <p>16 - 30 High Street, Southport, Qld, 4215</p>
              </div>
              <div className="ml-6">
                <h3 className="font-bold">Postal</h3>
                <p>Community Child Health</p>
                <p>1 Hospital Blvd,</p>
                <p>Southport, Qld, 4215</p>
              </div>
              <div className="ml-6">
                <h3 className="font-bold">Phone</h3>
                <p>(07) 5687 9183</p>
              </div>
              <div className="ml-6">
                <h3 className="font-bold">Fax</h3>
                <p>(07) 5687 9168</p>
              </div>
            </div>
            {/* Additional Information */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold"></h3>
              <ul className="list-none ml-4">
                {additionalInfo.parents && <li>Parents: {additionalInfo.parents}</li>}
                {additionalInfo.referrer && <li>Referrer: {additionalInfo.referrer}</li>}
                {additionalInfo.gp && <li>GP: {additionalInfo.gp}</li>}
                {additionalInfo.unitingCare && (
                  <li>
                    UnitingCare: <a href="mailto:unitingcare.earlychildhood@ndis.gov.au" className="text-blue-600 underline">unitingcare.earlychildhood@ndis.gov.au</a>
                  </li>
                )}
{additionalInfo.privateProvider && <li>Private Provider: {additionalInfo.privateProvider}</li>}
  <li>GCHHS iEMR</li>
</ul>
</div>
  
{/* Footer with custom spacing */}
<div className="pdf-only pdf-footer generated-footer">
  <span>Report Generated: {new Date().toLocaleString()}</span>
  <span className="page-number"></span>
</div>
          </div>

          {/* Buttons for PDF and Print */}
          <div className="my-10 flex justify-center space-x-4">
            <button className="border-2 border-primary text-primary px-28 py-2 rounded-full flex" onClick={handleDownloadPDF}>
              <img src="/lets-icons_print-duotone.svg" alt="print" /> Download PDF
            </button>
            <button className="border-2 border-primary text-primary px-28 py-2 rounded-full flex" onClick={handlePrint}>
              <img src="/lets-icons_print-duotone.svg" alt="print" /> Print
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default DetailPage;
