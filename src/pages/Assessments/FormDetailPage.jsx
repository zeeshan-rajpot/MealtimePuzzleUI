import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { useFetchInterventionQuery } from "../../features/Forms/ChildInfo";
import { useState } from "react";

const FormDetailPage = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  const [selectedSession, setSelectedSession] = useState("session 1");

  const { urn } = useParams();

  const {
    data: intervention,
    error,
    isLoading,
  } = useFetchInterventionQuery(urn);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading intervention data.</p>;

  const childData = intervention?.childData;
  const sessionData = intervention?.data[selectedSession]; // Default or selected session data
  const allSessions = Object.keys(intervention?.data || {});

  const handleSessionChange = (event) => {
    setSelectedSession(event.target.value);
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

          <div className="w-full max-w-3xl mx-auto pb-12 ">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-semibold ">Child Information</h2>
            </div>

            <div className="mt-4 space-y-6">
              <p className="text-sm font-medium">URN:</p>
              <p className="border-b-2">{childData?.urn}</p>
              <div className="flex spce-betwee items-center space-x-3">
                <div className="flex-col w-[50%]">
                  <p className="text-sm font-medium ">Child First Name:</p>
                  <p className="border-b-2 py-1">{childData?.firstName}</p>
                </div>
                <div className="flex-col  w-[50%]">
                  <p className="text-sm font-medium">Child Last Name:</p>
                  <p className="border-b-2 py-1">{childData?.lastName}</p>
                </div>
              </div>

              <p className="text-sm font-medium">Parent/Caretaker Name:</p>
              <p className="border-b-2 ">{childData?.parentName}</p>
              <p className="text-sm font-medium">Date of Birth:</p>
              <p className="border-b-2 ">{childData?.dateOfBirth}</p>

              <p className="text-sm font-medium">Email:</p>
              <p className="border-b-2 ">{childData?.contactEmail}</p>
              <p className="text-sm font-medium">Contact Number:</p>
              <p className="border-b-2 ">{childData?.contactPhone}</p>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-semibold ">Mealtime</h2>

              {sessionData?.length > 0 ? (
                sessionData.map((step, index) => (
                  <div key={index} className="space-y-6">
                    {/* Session Dropdown inside the map */}
                    <div className="flex items-center mb-4 justify-between">
                      <h2 className="text-lg font-semibold mr-4 mt-3">
                        Session:
                      </h2>
                      <select
                        value={selectedSession}
                        onChange={handleSessionChange}
                        className="border border-gray-300 px-3 py-2 rounded"
                      >
                        {allSessions.length > 0 ? (
                          allSessions.map((session, index) => (
                            <option key={index} value={session}>
                              {session.charAt(0).toUpperCase() +
                                session.slice(1)}
                            </option>
                          ))
                        ) : (
                          <option>No sessions available</option>
                        )}
                      </select>
                    </div>

                    <h3 className="mt-8 text-lg font-semibold">
                      {step.domainname || "Unknown Category"}
                    </h3>

                    <p className="text-sm font-medium">Clinical Prompt: </p>
                    <p className="border-b-2 ">
                      {step.clinicalPrompt || "not found"}
                    </p>
                    <p className="text-sm font-medium">Impression: </p>
                    <p className="border-b-2 ">
                      {step.impression || "not found"}
                    </p>
                    <p className="text-sm font-medium">Recommendation: </p>
                    <p className="border-b-2 ">
                      {step.recommendation || "not found"}
                    </p>
                  </div>
                ))
              ) : (
                <p>No data available for this session.</p>
              )}
            </div>

            <div className="mt-10 flex justify-center space-x-4">
              <Link to={`/home/options`}>
                <button className="bg-custom-gradient text-white px-32 py-2 rounded-full">
                  Update
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FormDetailPage;
