import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../features/config";

const GenerateReport = () => {
  const { urn, childName } = useParams();
  const navigate = useNavigate();

  const [isWhoModalOpen, setIsWhoModalOpen] = useState(true);
  const [isAdditionalInfoModalOpen, setIsAdditionalInfoModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isRecommendationModalOpen, setIsRecommendationModalOpen] = useState(false);

  const [data, setData] = useState({});
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState({
    parents: "",
    referrer: "",
    gp: "",
    privateProvider: "",
  });
  const [childHistory, setChildHistory] = useState("");
  const [reportRecommendation, setReportRecommendation] = useState("");

  useEffect(() => {
    // Fetch data on mount
    const fetchReportData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${baseUrl}/get/intervention/${urn}/latest`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const apiData = response.data;
        setData(apiData);
        setSelectedMembers(apiData.members || []);
        setAdditionalInfo({
          parents: apiData.additionalInfo?.parents || "",
          referrer: apiData.additionalInfo?.referrer || "",
          gp: apiData.additionalInfo?.gp || "",
          privateProvider: apiData.additionalInfo?.privateProvider || "",
        });
        setChildHistory(apiData.childHistory || "");
        setReportRecommendation(apiData.reportRecommendation || "");
      } catch (error) {
        console.error("Error fetching report data:", error);
        toast.error("Failed to load report data");
      }
    };
    fetchReportData();
  }, [urn]);

  const handleAddMember = () => {
    setSelectedMembers([...selectedMembers, { username: "", role: "" }]);
  };

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...selectedMembers];
    updatedMembers[index][field] = value;
    setSelectedMembers(updatedMembers);
  };

  const handleAdditionalInfoChange = (field, value) => {
    setAdditionalInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextFromWhoModal = () => {
    setIsWhoModalOpen(false);
    setIsAdditionalInfoModalOpen(true);
  };

  const handleNextFromAdditionalInfoModal = () => {
    setIsAdditionalInfoModalOpen(false);
    setIsHistoryModalOpen(true);
  };

  const handleNextFromHistoryModal = () => {
    setIsHistoryModalOpen(false);
    setIsRecommendationModalOpen(true);
  };

  const handleNextFromRecommendationModal = () => {
    navigate(`/home/detailpage/${urn}`);
  };

  return (
    <>
      <Header />
      <section className="flex flex-col lg:flex-row gap-4 w-full">
        <SideBar />
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">Generate Report for {childName}</h2>

          {/* Who has done this assessment? Modal */}
          {isWhoModalOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
              <div className="bg-white p-8 rounded-lg w-[70%]">
                <h2 className="text-2xl font-semibold mb-4">Who has done this assessment?</h2>
                {selectedMembers.map((member, index) => (
                  <div key={index} className="flex gap-4 my-4">
                    <input
                      className="border py-2 px-3 rounded-md w-full"
                      placeholder="Enter Name"
                      value={member.username}
                      onChange={(e) => handleMemberChange(index, "username", e.target.value)}
                    />
                    <input
                      className="border py-2 px-3 rounded-md w-full"
                      placeholder="Enter Role"
                      value={member.role}
                      onChange={(e) => handleMemberChange(index, "role", e.target.value)}
                    />
                  </div>
                ))}
                <button
                  onClick={handleAddMember}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full mt-4"
                >
                  + Add Another Member
                </button>
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setIsWhoModalOpen(false)}
                    className="bg-red-500 text-white px-6 py-2 rounded-full mr-4"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNextFromWhoModal}
                    className="bg-green-500 text-white px-6 py-2 rounded-full"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Additional Information Modal */}
          {isAdditionalInfoModalOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
              <div className="bg-white p-8 rounded-lg w-[60%]">
                <h2 className="text-center mb-6 text-2xl font-semibold">Additional Information</h2>
                {Object.keys(additionalInfo).map((field) => (
                  <div key={field} className="flex flex-col my-4">
                    <label>{field.replace(/([A-Z])/g, " $1")}</label>
                    <input
                      className="border py-2 px-3 rounded-md w-full"
                      placeholder={`Enter ${field}`}
                      value={additionalInfo[field]}
                      onChange={(e) => handleAdditionalInfoChange(field, e.target.value)}
                    />
                  </div>
                ))}
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setIsAdditionalInfoModalOpen(false)}
                    className="bg-red-500 text-white px-6 py-2 rounded-full mr-4"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNextFromAdditionalInfoModal}
                    className="bg-green-500 text-white px-6 py-2 rounded-full"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Child History Modal */}
          {isHistoryModalOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
              <div className="bg-white p-8 rounded-lg w-[60%]">
                <h2 className="text-center mb-6 text-2xl font-semibold">Child History</h2>
                <textarea
                  className="border py-2 px-3 w-full rounded-md"
                  rows="6"
                  value={childHistory}
                  onChange={(e) => setChildHistory(e.target.value)}
                  placeholder="Enter child history here..."
                ></textarea>
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setIsHistoryModalOpen(false)}
                    className="bg-red-500 text-white px-6 py-2 rounded-full mr-4"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNextFromHistoryModal}
                    className="bg-green-500 text-white px-6 py-2 rounded-full"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Report Recommendation Modal */}
          {isRecommendationModalOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
              <div className="bg-white p-8 rounded-lg w-[60%]">
                <h2 className="text-center mb-6 text-2xl font-semibold">Report Recommendation</h2>
                <textarea
                  className="border py-2 px-3 w-full rounded-md"
                  rows="6"
                  value={reportRecommendation}
                  onChange={(e) => setReportRecommendation(e.target.value)}
                  placeholder="Enter report recommendation here..."
                ></textarea>
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setIsRecommendationModalOpen(false)}
                    className="bg-red-500 text-white px-6 py-2 rounded-full mr-4"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNextFromRecommendationModal}
                    className="bg-green-500 text-white px-6 py-2 rounded-full"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default GenerateReport;
