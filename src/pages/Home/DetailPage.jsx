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

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  const [loading, setLoading] = useState(true); // Loading state for the API call

  // Fetch intervention data from API
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
          console.log("No data available");
        }
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
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

  // Configure react-to-print for printing functionality
  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: `${childData?.firstName}_${childData?.lastName}_Report`,
    onAfterPrint: () => console.log("Print completed"), // Log after print completion
  });

  // Handle PDF download functionality with options
  const handleDownloadPDF = () => {
    const options = {
      margin: 0.5,
      filename: `${childData?.firstName}_${childData?.lastName}_Report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' }
    };
    html2pdf().from(reportRef.current).set(options).save();
  };

  // Handle image upload of the report section
  const handleUpload = useCallback(async () => {
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL('image/png');

    const blob = await (await fetch(imgData)).blob();

    const formData = new FormData();
    formData.append('image', blob, `${urn}-report.png`); // Naming the file with child's URN

    // Get the token from localStorage
    const token = localStorage.getItem('token');

    try {
      await axios.post(`http://localhost:5001/child/${urn}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // Include the token in the request
        },
      });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }, [urn]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleUpload();
    }, 3000); // Delay image upload by 3 seconds

    // Cleanup function to clear the timeout if the component unmounts before the delay completes
    return () => clearTimeout(timer);
  }, [handleUpload]);

  const accessors = JSON.parse(localStorage.getItem('accessors')) || [];
  const additionalInfo = JSON.parse(localStorage.getItem('additionalInfo')) || {};

  return (
    <>
      <Header />
      <section className="flex flex-col lg:flex-row justify-between gap-4 h-auto w-full">
        <SideBar />
        <div className="pt-10 w-full h-auto">
          <div className="w-full max-w-3xl mx-auto mb-20 bg-white" ref={reportRef}>
            <div className="flex space-x-20">
              <img src="/logo.PNG" alt="logo" className="h-12" />
              <img src="/CDS Logo.png" alt="logo-1" className="h-20 w-48" />
              <div className="flex flex-col">
                <div>URN: {childData?.urn || "N/A"}</div>
                <div>Family name: {childData?.lastName || "N/A"}</div>
                <div>Given name(s): {childData?.firstName || "N/A"}</div>
                <div>Date of birth: {new Date(childData?.dateOfBirth).toLocaleDateString() || "N/A"}</div>
                <div>
                  Sex: {childData?.gender === "male" ? "M" : childData?.gender === "female" ? "F" : "O"}
                </div>
                <div>FIN: {childData?.finnumber || "N/A"}</div>
              </div>
            </div>
            <div className="flex flex-col ms-32 ">
              <div className="text-xl font-normal">Gold Coast Health</div>
              <div className="text-2xl font-bold -ms-2">CDS MEALTIME</div>
              <div className="text-2xl font-bold -ms-5">CLINICAL REPORT</div>
            </div>
            <div className="mt-4 text-base font-normal">
              Facility: Southport Health Precinct
            </div>
            <div className="mt-16 text-center">
              <div className="text-lg font-bold">Child Development Service (CDS)</div>
              <div className="text-lg font-bold">Mealtime Clinical Report</div>
            </div>

            {/* Additional Information */}
            <div className="mt-16">
              <table className="w-full max-w-3xl mx-auto">
                <thead>
                  <tr className="border-2">
                    <th className="border-b-2 text-lg font-normal">Patient Name:</th>
                    <th className="border-l-2 text-lg font-normal">{childData?.firstName || "firstname"} {childData?.lastName || "lastname"}</th>
                  </tr>
                  <tr className="border-2">
                    <th className="border-b-2 text-lg font-normal">Date of Birth:</th>
                    <th className="border-l-2 text-lg font-normal">{new Date(childData?.dateOfBirth).toLocaleDateString() || "dob"}</th>
                  </tr>
                  <tr className="border-2">
                    <th className="border-b-2 text-lg font-normal">Age</th>
                    <th className="border-l-2 text-lg font-normal">{childData?.dateOfBirth ? calculateAge(new Date(childData.dateOfBirth), new Date()) : "age not available"}</th>
                  </tr>
                  <tr className="border-2">
                    <th className="border-b-2 text-lg font-normal">Date of Report:</th>
                    <th className="border-l-2 text-lg font-normal">{new Date().toLocaleDateString()}</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className="mt-12">
              <p className="text-lg font-normal">
                {childData?.firstName} {childData?.lastName} attended for evaluation by the multi-disciplinary team consisting of:
              </p>
              <table className="w-full max-w-3xl mx-auto mt-8">
                {accessors.length > 0 ? (
                  accessors.map((item, index) => (
                    <thead key={index}>
                      <tr>
                        <th className="text-lg font-normal">{item.username || '[Name]'}</th>
                        <th className="text-lg font-normal">{item.role || '[Role]'}</th>
                      </tr>
                    </thead>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-lg font-normal text-center">
                      No data found
                    </td>
                  </tr>
                )}
              </table>
            </div>
            <div className="mt-16 relative">
              <p className="bg-black text-white text-lg font-normal ps-2">
                BACKGROUND INFORMATION:
              </p>
              <p className="mt-8">

                {childData?.childHistory }

              </p>
            </div>

            <div className="p-4 space-y-6 mt-12">
              <div className="flex justify-between w-full">
                <h2 className="bg-black text-white text-lg font-normal ps-2 w-full text-left">
                  CDS MEALTIME PUZZLE SUMMARY
                </h2>
              </div>

              <div>
                {sessionData?.interventions?.length > 0 ? (
                  sessionData.interventions.map((intervention, index) => (
                    <div key={index} className="p-4 border-b">
                      <h3 className="font-semibold text-xl mb-3">{intervention.domainName}</h3>
                      <p className="font-normal text-lg mb-2">
                        {intervention.priority ? `${intervention.priority.charAt(0).toUpperCase()}${intervention.priority.slice(1)}` : 'No priority'} Priority
                      </p>
                      {intervention.formulation && (
                        <p><strong>Formulation:</strong> {intervention.formulation}</p>
                      )}
                      {intervention.recommendation && (
                        <p><strong>Recommendation:</strong> {intervention.recommendation}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No session entries available</p>
                )}
              </div>
            </div>

            <div className="mt-16 relative">
              <p className="bg-black text-white text-lg font-normal ps-2">
                RECOMMENDATION:
              </p>
              <p className="mt-8">
                {childData?.RecommendationChild || "No recommendations available"}
              </p>
              <div>
                <img src="/qr.PNG" alt="qrcode" className="absolute -left-32 top-32" />
              </div>

              <div className="flex justify-between items-start mt-6 ">
                <div>
                  <h3 className="font-bold">Office</h3>
                  <p>Child Development Service</p>
                  <p>Level 3, Southport Health Precinct</p>
                  <p>16 - 30 High Street, Southport, Qld, 4215</p>
                </div>
                <div>
                  <h3 className="font-bold">Postal</h3>
                  <p>Community Child Health</p>
                  <p>1 Hospital Blvd,</p>
                  <p>Southport, Qld, 4215</p>
                </div>
                <div>
                  <h3 className="font-bold">Phone</h3>
                  <p>(07) 5687 9183</p>
                </div>
                <div>
                  <h3 className="font-bold">Fax</h3>
                  <p>(07) 5687 9168</p>
                </div>
              </div>

              {/* cc Section */}
              <div className="mt-4">
                <p>cc</p>
                <ul className="list-none">
                  {additionalInfo.parents && <li>{"Parents: " + additionalInfo.parents}</li>}
                  {additionalInfo.referrer && <li>{"Referrer: " + additionalInfo.referrer}</li>}
                  {additionalInfo.gp && <li>{"GP: " + additionalInfo.gp}</li>}
                  {additionalInfo.unitingCare && (
                    <li>
                      <a href="mailto:unitingcare.earlychildhood@ndis.gov.au" className="text-blue-600 underline">unitingcare.earlychildhood@ndis.gov.au</a> (via secure server)
                    </li>
                  )}
                  {additionalInfo.privateProvider && <li>{"Private Provider: " + additionalInfo.privateProvider}</li>}
                  <li>GCHHS iEMR</li>
                </ul>
              </div>
            </div>
          </div>
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