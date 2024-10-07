import React, { useEffect, useState, useRef } from "react";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

const DetailPage = () => {
  const { urn, session } = useParams();
  const reportRef = useRef(null);

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

  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: `Clinical_Report_${urn}`,
    onBeforePrint: () => console.log("Preparing to print..."),
    onAfterPrint: () => console.log("Print completed!"),
  });

  return (
    <>
      <Header />
      <section className="flex flex-col lg:flex-row justify-between gap-4 h-auto w-full">
        <SideBar />
        <div
          ref={reportRef}
          className="pt-10 w-full lg:w-[75%] xl:w-[80%] 2xl:w-[85%] h-auto"
        >
          <div className="w-full max-w-3xl mx-auto mb-20 ">
            <div className="flex space-x-20">
              <img src="/logo.PNG" alt="logo" className="h-12" />
              <img src="/CDS Logo.PNG" alt="logo-1" className="h-28" />
              <div className="flex flex-col">
                <div>URN: {interventionData?.child?.urn || "urn"}</div>
                <div>
                  Family name:{" "}
                  {interventionData?.child?.firstName || "firstname"}
                  {interventionData?.child?.lastName || "lastname"}
                </div>
                <div>
                  Given name(s):{" "}
                  {interventionData?.child?.firstName || "firstname"}{" "}
                  {interventionData?.child?.lastName || "lastname"}{" "}
                </div>

                <div className="flex space-x-10">
                  <div>
                    Date of birth:{" "}
                    {new Date(
                      interventionData?.child?.dateOfBirth
                    ).toLocaleDateString() || "dob"}{" "}
                  </div>
                  <div>Sex: {interventionData?.child?.gender || "gender"} </div>
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
                <thead>
                  <tr>
                    <th className=" text-lg font-normal">[Name]</th>
                    <th className=" text-lg font-normal">Paediatrician</th>
                  </tr>
                  <tr>
                    <th className=" text-lg font-normal">[Name]</th>
                    <th className=" text-lg font-normal">
                      Speech Language Patholog
                    </th>
                  </tr>
                  <tr>
                    <th className=" text-lg font-normal">[Name]</th>
                    <th className=" text-lg font-normal">Psychologist</th>
                  </tr>
                  <tr>
                    <th className=" text-lg font-normal">[Name]</th>
                    <th className=" text-lg font-normal">
                      Occupational Therapist
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className="mt-16 relative">
              <p className="bg-black text-white text-lg font-normal ps-2">
                BACKGROUND INFORMATION:
              </p>
              <p>
                {interventionData?.child?.firstName}{" "}
                {interventionData?.child?.lastName} was referred to the Child
                Development Service by [Referrer] in{" "}
                {new Date(
                  interventionData?.child?.dateOfBirth
                ).toLocaleDateString()}{" "}
                with concerns regarding [reason for referral] .
              </p>
              <p className="mt-8">
                {interventionData?.child?.firstName}{" "}
                {interventionData?.child?.lastName} is a{" "}
                {interventionData?.child?.dateOfBirth
                  ? calculateAge(
                      new Date(interventionData.child.dateOfBirth),
                      new Date()
                    )
                  : "age not available"}{" "}
                old who lives with [describe living arrangements without
                sensitive info] . They attend [childcare / school name] [Number
                of days] days per week.
              </p>
              <p className="mt-8">
                At the initial appointment, {interventionData?.child?.firstName}{" "}
                {interventionData?.child?.lastName}’s parent{" "}
                {interventionData?.child?.parentName} raised the following
                questions and concerns:
                <li>[Add]</li>
              </p>
              <p className="mt-8">
                At the initial appointment, {interventionData?.child?.firstName}{" "}
                {interventionData?.child?.lastName}’s childcare/ kindy/ school
                also reported the following concerns:
                <li>[Add]</li>
              </p>
              <p className="mt-8">
                At the initial appointment, {interventionData?.child?.firstName}{" "}
                {interventionData?.child?.lastName}’s has previously been or is
                currently involved with the following services:
                <li>
                  [add any previous assessments or support services seen,
                  including when and where]{" "}
                </li>
              </p>
              <div>
                <img
                  src="/qr.PNG"
                  alt="qrcode"
                  className="absolute -left-32 top-32"
                />
              </div>
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
            <div className="p-4 space-y-6 mt-12">
              {/* Report Header */}
              <div className="flex justify-between ">
                <h2 className="font-bold">CDS Mealtime Clinical Report</h2>
              </div>
              <div className="flex justify-between pb-32">
                <div>
                  Name: {interventionData?.child.firstName}{" "}
                  {interventionData?.child.lastName}
                </div>
                <div>
                  DOB:{" "}
                  {new Date(
                    interventionData?.child?.dateOfBirth
                  ).toLocaleString()}
                </div>
                <div>URN:{interventionData?.child?.urn}</div>
              </div>

              {/* Main Body */}
              <p>
                We will be glad to respond to questions arising out of this
                assessment by contacting CDS.
              </p>

              {/* Professional Contacts */}
              <div className="grid grid-cols-2 gap-6">
                {/* Left column */}
                <div>
                  <div className="font-bold ">[Name]</div>
                  <p>Paediatrician</p>
                </div>
                <div>
                  <div className="font-bold ">[Name]</div>
                  <p>Speech Language Pathologist</p>
                </div>
                <div>
                  <div className="font-bold ">[Name]</div>
                  <p>Psychologist</p>
                </div>
                <div>
                  <div className="font-bold ">[Name]</div>
                  <p>Occupational Therapist</p>
                </div>
              </div>

              {/* cc Section */}
              <div className="mt-4">
                <p>cc</p>
                <ul className="list-none">
                  <li>Parents: [address]</li>
                  <li>Referrer: [address]</li>
                  <li>GP: [address]</li>
                  <li>
                    <a
                      href="mailto:unitingcare.earlychildhood@ndis.gov.au"
                      className="text-blue-600 underline"
                    >
                      unitingcare.earlychildhood@ndis.gov.au
                    </a>{" "}
                    (via secure server)
                  </li>
                  <li>Private Provider [address]</li>
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
