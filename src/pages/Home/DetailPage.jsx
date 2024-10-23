import React, { useEffect, useState, useRef } from "react";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import { toPng } from 'html-to-image';
import axios from 'axios';
const DetailPage = () => {
  const { urn, session } = useParams();
  const reportRef = useRef(null);
  const [accessorsData, setAccessorsData] = useState(null);

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  const [interventionData, setInterventionData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for the API call

  // Fetch intervention data from API
  useEffect(() => {
    const fetchInterventionData = async () => {
      setLoading(true); // Set loading to true when starting the fetch
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from local storage
        const response = await fetch(
          `http://localhost:5001/api/get/Intervention/${urn}/${session}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        // Check if data is empty and handle accordingly
        if (!data || Object.keys(data).length === 0) {
          console.log("Data is empty");
          setInterventionData([]); // Or set a message to indicate no data
          return; // Exit the function early
        }

        setInterventionData(data);
        console.log("Intervention", data);
      } catch (error) {
        console.error("Error fetching intervention data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterventionData();
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

  // const handlePrint = useReactToPrint({
  //   content: () => reportRef.current,
  //   documentTitle: `Clinical_Report_${urn}`,
  //   onBeforePrint: () => console.log("Preparing to print..."),
  //   onAfterPrint: () => console.log("Print completed!"),
  // });



  const handlePrint = () => {
    const element = reportRef.current; // The specific section you want to print

    // Create a new window
    const printWindow = window.open('', '', 'width=800,height=600');

    // Create a copy of the HTML you want to print
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Report</title>
          <style>
            /* Add any styles you want for the printed document */
            body {
              font-family: Arial, sans-serif;
            }
          </style>
        </head>
        <body>
          <div class="print-section">${element.innerHTML}</div>
        </body>
      </html>
    `);

    // Close the document stream
    printWindow.document.close();

    // Wait for the content to load, then trigger print
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };




  const handleUpload = async () => {
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL('image/png');

    const blob = await (await fetch(imgData)).blob();

    const formData = new FormData();
    formData.append('image', blob, `${urn}-report.png`); // Naming the file with child's URN

    // Get the token from localStorage
    const token = localStorage.getItem('token'); // Change 'token' to your actual token key

    try {
      const response = await axios.post(`http://localhost:5001/child/${urn}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // Include the token in the request
        },
      });
      console.log(response.data); // Handle the response as needed
    } catch (error) {
      console.error('Error uploading image:', error);
    }


  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleUpload();
    }, 3000); // 3000 milliseconds = 3 seconds

    // Cleanup function to clear the timeout if the component unmounts before the delay completes
    return () => clearTimeout(timer);
  }, []);

  const accessors = JSON.parse(localStorage.getItem('accessors')) || [];

  const additionalInfo = JSON.parse(localStorage.getItem('additionalInfo')) || {};

  return (
    <>
      <Header />
      <section className="flex flex-col lg:flex-row justify-between gap-4 h-auto w-full">
        <SideBar />
        <div

          className="pt-10 w-full  h-auto"
        >
          <div className="w-full max-w-3xl mx-auto mb-20  bg-white" ref={reportRef}>
            <div className="flex space-x-20">
              <img src="/logo.PNG" alt="logo" className="h-12" />
              <img src="/CDS Logo.png" alt="logo-1" className="h-20 w-48" />
              <div className="flex flex-col">
                <div>URN: {interventionData?.child?.urn || "urn"}</div>
                <div>
                  Family name:{" "}
                  {interventionData?.child?.lastName || "lastname"}
                </div>
                <div>
                  Given name(s):{" "}
                  {interventionData?.child?.firstName || "firstname"}{" "}
                </div>

                <div className="flex space-x-10">
                  <div className="text-nowrap	">
                    Date of birth:{" "}
                    {new Date(
                      interventionData?.child?.dateOfBirth
                    ).toLocaleDateString() || "dob"}{" "}
                  </div>
                  <div className="text-nowrap	">Sex: {interventionData?.child?.gender || "gender"} </div>
                </div>
                <div>
                  FIN: {interventionData?.child?.finnumber || "finNumber"}
                </div>
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
              <div className="text-lg font-bold">
                {" "}
                Child Development Service (CDS)
              </div>
              <div className="text-lg font-bold">Mealtime Clinical Report</div>
            </div>
            <div className="mt-8 text-lg font-normal">Parent / Carer</div>
            <div className="text-lg font-normal">Street Address</div>
            <div className="flex space-x-8">
              <div className="text-lg font-normal">Suburb</div>
              <div className="text-lg  font-normal">QLD</div>
              <div className="text-lg font-normal">Postcode</div>
            </div>
            <div className="mt-16">
              <table className="w-full max-w-3xl mx-auto">
                <thead>
                  <tr className=" border-2">
                    <th className="border-b-2 text-lg font-normal">
                      Patient Name:
                    </th>
                    <th className="border-l-2 text-lg font-normal">
                      {" "}
                      {interventionData?.child?.firstName || "firstname"}{" "}
                      {interventionData?.child?.lastName || "lastname"}
                    </th>
                  </tr>
                  <tr className=" border-2">
                    <th className="border-b-2 text-lg font-normal">
                      Date of Birth:
                    </th>
                    <th className="border-l-2 text-lg font-normal">
                      {new Date(
                        interventionData?.child?.dateOfBirth
                      ).toLocaleDateString() || "dob"}{" "}
                    </th>
                  </tr>
                  <tr className=" border-2">
                    <th className="border-b-2 text-lg font-normal">
                      Chronological age at time of Initial appointment:
                    </th>
                    <th className="border-l-2 text-lg font-normal">
                      {interventionData?.child?.dateOfBirth
                        ? calculateAge(
                          new Date(interventionData.child.dateOfBirth),
                          new Date()
                        )
                        : "age not available"}{" "}
                    </th>
                  </tr>
                  <tr className=" border-2">
                    <th className="border-b-2 text-lg font-normal">
                      Date of Report:
                    </th>
                    <th className="border-l-2 text-lg font-normal">
                      {new Date().toLocaleDateString()}
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className="mt-12">
              <p className="text-lg font-normal">
                {interventionData?.child?.firstName}{" "}
                {interventionData?.child?.lastName} attended for evaluation by
                the multi-disciplinary team consisting of:
              </p>
              <table className="w-full max-w-3xl mx-auto mt-8">
                {accessors.length > 0 ? (
                  accessors.map((item, index) => (
                    <thead key={index}>
                      <tr>
                        <th className=" text-lg font-normal">{item.username || '[Name]'}</th>
                        <th className=" text-lg font-normal">{item.role || '[Role]'}</th>
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
                {interventionData?.childHistory}
              </p>
              <div>
                <img
                  src="/qr.PNG"
                  alt="qrcode"
                  className="absolute -left-32 top-32"
                />
              </div>
            </div>

            <div className="p-4 space-y-6 mt-12">
              {/* Report Header */}
              <div className="flex justify-between ">
                <h2 className="font-bold">CDS Mealtime Clinical Report</h2>
              </div>

              <div>
                {interventionData?.sessionEntries?.length > 0 ? (
                  interventionData.sessionEntries.map((entry, index) => (
                    <div key={index} className="p-4 border-b">
                      <h3 className="font-semibold">Session {index + 1}</h3>
                      <p><strong>Priority:</strong> {entry.priority}</p>
                      <p><strong>Clinical Prompt:</strong> {entry.clinicalPrompt}</p>
                      <p><strong>Formulation:</strong> {entry.formulation}</p>
                      <p><strong>Recommendation:</strong> {entry.recommendation}</p>

                    </div>
                  ))
                ) : (
                  <p>No session entries available</p>
                )}
              </div>


              <div className="flex justify-between items-start mt-6 ">
                {/* Office Column */}
                <div>
                  <h3 className="font-bold">Office</h3>
                  <p>Child Development Service</p>
                  <p>Level 3, Southport Health Precinct</p>
                  <p>16 - 30 High Street, Southport, Qld, 4215</p>
                </div>

                {/* Postal Column */}
                <div>
                  <h3 className="font-bold">Postal</h3>
                  <p>Community Child Health</p>
                  <p>1 Hospital Blvd,</p>
                  <p>Southport, Qld, 4215</p>
                </div>

                {/* Phone and Fax Column */}
                <div>
                  <h3 className="font-bold">Phone</h3>
                  <p>(07) 5687 9183</p>
                </div>
                <div>
                  <h3 className="font-bold ">Fax</h3>
                  <p>(07) 5687 9168</p>
                </div>
              </div>

              {/* cc Section */}
              <div className="mt-4">
                <p>cc</p>
                <ul className="list-none">
                  <li> {"Parents:" + additionalInfo.parents || ''}</li>
                  <li> {"Referrer:" + additionalInfo.referrer || 'not found'}</li>
                  <li> {"GP:" + additionalInfo.gp || 'not found'}</li>
                  <li>
                    <a
                      href="mailto:unitingcare.earlychildhood@ndis.gov.au"
                      className="text-blue-600 underline"
                    >
                      unitingcare.earlychildhood@ndis.gov.au
                    </a>{" "}
                    (via secure server)
                  </li>
                  <li> {"Private Provider:" + additionalInfo.privateProvider || 'not found'}</li>
                  <li>GCHHS iEMR</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="my-10 flex justify-center space-x-4">
            <button
              className="border-2 border-primary text-primary px-28 py-2 rounded-full flex"
              onClick={handlePrint}
            >
              <img src="/lets-icons_print-duotone.svg" alt="print" />
              Download PDF
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default DetailPage;
