import React, { useEffect, useState } from "react";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate} from "react-router-dom";

const Buttunpage = () => {
  const { urn, childName } = useParams();
  const [totalSessions, setTotalSessions] = useState(0);
  const [childData, setChildData] = useState('');

  
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/get/childSessions/${urn}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTotalSessions(response.data.totalSessions);
        console.log(response)
      } catch (error) {
        toast.error("Failed to fetch session data");
        console.error("Error fetching session data:", error);
      }
    };

    if (urn) {
      fetchSessions();
    }
  }, [urn]);

  useEffect(() => {
    // Define an async function to fetch the data
    const fetchChildData = async () => {
      try {

        const response = await axios.get(`http://localhost:5001/api/child/${urn}` ,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

    console.log(response.data)
    setChildData(response?.data)

      } catch (err) {
        console.log('Failed to fetch child data'); // Set error message in case of failure
      } 
    };
    fetchChildData()
  }, [urn]);

  console.log(childData?.childHistory)


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [childHistory, setChildHistory] = useState("");
  const [childHistoryError, setChildHistoryError] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isAdditionalInfoModalOpen, setIsAdditionalInfoModalOpen] =
    useState(false);
  const [isRecommendationModalOpen, setIsRecommendationModalOpen] = useState(false);
  const [reportRecommendation, setReportRecommendation] = useState("");
  const [recommendationError, setRecommendationError] = useState(false);


 




  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([{ username: "", role: "" }]);
  const [newMember, setNewMember] = useState({ username: "", role: "" });
  const [showInputs, setShowInputs] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/users");
        console.log(response.data)
        setUsers((prevUsers) => [...response.data, ...prevUsers.filter(user => user.isNew)]);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddMember = () => {
    if (newMember.username && newMember.role) {
      const memberWithFlag = { ...newMember, isNew: true };
      setMembers([...members, memberWithFlag]);
      setUsers([...users, memberWithFlag]);
      setNewMember({ username: "", role: "" });
    } else {
      console.error("Please fill both fields");
    }
  };

  const handleAddDropdown = () => {
    setMembers([...members, { username: "", role: "", isNew: true }]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedMembers = [...members];
    if (field === "username") {
      const selectedUser = users.find(user => `${user.firstName} ${user.lastName}` === value);
      updatedMembers[index].username = value;
      updatedMembers[index].role = selectedUser ? selectedUser.role : "";
    } else {
      updatedMembers[index][field] = value;
    }
    setMembers(updatedMembers);
    localStorage.setItem("accessors", JSON.stringify(updatedMembers));
  };

  const handleNewMemberChange = (field, value) => {
    setNewMember((prev) => ({ ...prev, [field]: value }));
  };

  const handleAssessmentNext = () => {
    setIsAssessmentModalOpen(false);
    setIsAdditionalInfoModalOpen(true);
  };


  const [additionalInfo, setAdditionalInfo] = useState({
    parents: "",
    referrer: "",
    gp: "",
    privateProvider: "",
  });

  const handleAdditionalInfoChange = (field, value) => {
    setAdditionalInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const [addressSuggestions, setAddressSuggestions] = useState([]);

  // Function to fetch addresses from RapidAPI
  const fetchAddressSuggestions = async (query) => {
    if (!query) return;

    try {
      const response = await axios.get("https://addressr.p.rapidapi.com/", {
        params: { query },  // Assuming 'query' is the parameter for the address
        headers: {
          "x-rapidapi-host": "addressr.p.rapidapi.com",
          "x-rapidapi-key": "7df33f1d15msha1c808d44e12e03p1c2b9cjsn3113ce343810", // Your RapidAPI key
        },
      });

      // Assuming the API response contains a list of suggested addresses
      setAddressSuggestions(response.data.addresses || []);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  };

  const handleAddressChange = (type, value) => {
    handleAdditionalInfoChange(type, value);
    fetchAddressSuggestions(value);  // Fetch suggestions when input changes
  };



  const handleNextClick = () => {
    setIsAssessmentModalOpen(true);
    setMembers([])
  };



  const handleSaveAdditionalInfo = () => {
    setIsAssessmentModalOpen(false);
    setAdditionalInfo([])
   setIsAdditionalInfoModalOpen(true); // Close modal after saving

  };
  const handleHistorySubmit = async () => {
    setIsAdditionalInfoModalOpen(false); 
    localStorage.setItem("additionalInfo", JSON.stringify(additionalInfo));
    setIsHistoryModalOpen(true); // Close history modal
    // setIsRecommendationModalOpen(true); 
  };


  useEffect(() => {
    if (childData?.childHistory) {
      setChildHistory(childData.childHistory);
    }
    if(childData?.RecommendationChild){
      setReportRecommendation(childData?.RecommendationChild)
    }
  }, [childData]);



   const handleOpenRecommendation = async() => {

    try {
      const response = await axios.put(
        `http://localhost:5001/api/child/update-history/${urn}`,
        { childHistory },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsHistoryModalOpen(false);
      setIsRecommendationModalOpen(true);
    } catch (error) {
      console.error('Error updating child history:', error);
      alert(error.response?.data?.message || 'Failed to update child history');
    }


    // Close modal after saving

  };
  const navigate = useNavigate();

const handleSubmitAll = async()=>{
  try {
    const response = await axios.put(
      `http://localhost:5001/api/child/update-recommendation/${urn}`,
      { RecommendationChild: reportRecommendation },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
 navigate(`/home/detailpage/${urn}/${totalSessions}`);

    alert(response.data.message); // Feedback message
  } catch (error) {
    console.error('Error updating recommendation:', error);
    alert(error.response?.data?.message || 'Failed to update recommendation');
  }


};

  return (
    <>
      <Header />
      <section className="flex flex-col lg:flex-row justify-between gap-4 h-auto w-full">
        <SideBar />
        <div className="pt-10 w-full lg:w-[75%] xl:w-[80%] 2xl:w-[85%] h-auto">
          <div className="flex flex-col justify-center items-center">
            <div className="w-full max-w-3xl mx-auto flex justify-center items-center flex-col">
              <h2 className="text-2xl font-bold mb-4">{childName}</h2>
              <h2 className="text-xl font-bold mb-4">
                Total Sessions: {totalSessions}
              </h2>
              <div className="flex flex-wrap gap-2">
                {/* Render a button for each session */}
                {Array.from({ length: totalSessions }, (_, index) => (
                  <>
                    <Link
                      to={`/interventionupdate/pyramid/${urn}/${
                        index + 1
                      }/${childName}`}
                    >
                      <button
                        key={index}
                        className="w-full py-3 px-10 bg-ceruleanBlue text-white rounded-full shadow-lg my-8 hover:bg-blushPink transition duration-300"
                      >
                        {" "}
                        Update Session {index + 1}
                      </button>
                    </Link>
                  </>
                ))}
              </div>

              <Link to={`/home/addnew/${urn}/${childName}/${totalSessions}`}>
                <button className="w-full py-3 px-10 bg-ceruleanBlue text-white rounded-full shadow-lg my-8 hover:bg-blushPink transition duration-300">
                  {" "}
                  Add New Assessment{" "}
                </button>
              </Link>
                <button onClick={handleNextClick} className="w-full py-3 px-10 bg-ceruleanBlue text-white rounded-full shadow-lg my-8 hover:bg-blushPink transition duration-300">
                  Generate Report
                </button>

            </div>
          </div>
        </div>
      </section>


      {isAssessmentModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-[90%] md:w-[60%]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Who has done this assessment?</h2>
              {/* <button
                onClick={() => setShowInputs(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Add Member
              </button> */}

            </div>
            {/* {showInputs && (
              <>
                <div className="flex flex-col my-4">
                  <label className="pb-1 font-medium">Name</label>
                  <input
                    className="border-2 border-gray-300 py-2 px-3 rounded-md w-full focus:outline-none focus:border-blue-500"
                    type="text"
                    placeholder="Enter name"
                    value={newMember.username}
                    onChange={(e) => handleNewMemberChange("username", e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col my-4">
                  <label className="pb-1 font-medium">Role</label>
                  <input
                    className="border-2 border-gray-300 py-2 px-3 rounded-md w-full focus:outline-none focus:border-blue-500"
                    type="text"
                    placeholder="Enter role"
                    value={newMember.role}

                  />
                </div>
                <div className="flex justify-center space-x-4">

                  <button
                    onClick={() => setShowInputs(false)}
                    className="bg-red-500 text-white px-8 py-2 rounded-full hover:bg-red-600 transition"
                  >
                    Close
                  </button>

                  <button
                    className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-2 rounded-full hover:from-blue-600 hover:to-green-600 transition"
                    onClick={handleAddMember}
                  >
                    Save
                  </button>
                </div>
              </>
            )} */}
            {members.map((member, index) => (
              <div key={index} className="flex space-x-4 items-center my-4">
                <div className="flex flex-col w-1/2">
                  <label className="pb-1 font-medium">Select Name</label>
                  <select
                    className="border-2 border-gray-300 py-2 px-3 rounded-md w-full focus:outline-none focus:border-blue-500"
                    onChange={(e) => handleInputChange(index, "username", e.target.value)}
                    value={member.username}
                  >
                    <option value="">Select Name</option>
                    {users.map((user, idx) => (
                      <option key={idx} value={`${user.firstName} ${user.lastName}`}>
                        {user.firstName} {user.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col w-1/2">
                  <label className="pb-1 font-medium">Role</label>
                  <input
                    className="border-2 border-gray-300 py-2 px-3 rounded-md w-full focus:outline-none focus:border-blue-500"
                    type="text"
                    value={member.role}
                    readOnly
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-center mt-4">
              <button
                onClick={handleAddDropdown}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                + Add Another Dropdown
              </button>
            </div>
            <div className="mt-8 flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => setIsAssessmentModalOpen(false)}
                className="bg-red-500 text-white px-8 py-2 rounded-full hover:bg-red-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAdditionalInfo}
                className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-2 rounded-full hover:from-blue-600 hover:to-green-600 transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}


{isAdditionalInfoModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[60%]">
            <h2 className="text-center mb-6 text-2xl font-semibold">
              Additional Information
            </h2>

            {/* Parents Address Input */}
            <div className="flex flex-col my-4">
              <label className="pb-1 font-medium">Parents [Address]</label>
              <input
                className="border-2 border-gray-300 py-2 px-3 rounded-md w-full"
                type="text"
                placeholder="Parents' Address"
                value={additionalInfo.parents}
                onChange={(e) => handleAddressChange("parents", e.target.value)}
              />
              {/* Address Suggestions */}
              {addressSuggestions.length > 0 && (
                <ul className="border-2 border-gray-300 rounded-md mt-2">
                  {addressSuggestions.map((address, index) => (
                    <li
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() =>
                        handleAdditionalInfoChange("parents", address)
                      }
                    >
                      {address}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Referrer Address Input */}
            <div className="flex flex-col my-4">
              <label className="pb-1 font-medium">Referrer [Address]</label>
              <input
                className="border-2 border-gray-300 py-2 px-3 rounded-md w-full"
                type="text"
                placeholder="Referrer's Address"
                value={additionalInfo.referrer}
                onChange={(e) => handleAddressChange("referrer", e.target.value)}
              />
              {addressSuggestions.length > 0 && (
                <ul className="border-2 border-gray-300 rounded-md mt-2">
                  {addressSuggestions.map((address, index) => (
                    <li
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() =>
                        handleAdditionalInfoChange("referrer", address)
                      }
                    >
                      {address}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* GP Address Input */}
            <div className="flex flex-col my-4">
              <label className="pb-1 font-medium">GP [Address]</label>
              <input
                className="border-2 border-gray-300 py-2 px-3 rounded-md w-full"
                type="text"
                placeholder="GP's Address"
                value={additionalInfo.gp}
                onChange={(e) => handleAddressChange("gp", e.target.value)}
              />
              {addressSuggestions.length > 0 && (
                <ul className="border-2 border-gray-300 rounded-md mt-2">
                  {addressSuggestions.map((address, index) => (
                    <li
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleAdditionalInfoChange("gp", address)}
                    >
                      {address}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Private Provider Address Input */}
            <div className="flex flex-col my-4">
              <label className="pb-1 font-medium">Private Provider [Address]</label>
              <input
                className="border-2 border-gray-300 py-2 px-3 rounded-md w-full"
                type="text"
                placeholder="Private Provider's Address"
                value={additionalInfo.privateProvider}
                onChange={(e) =>
                  handleAddressChange("privateProvider", e.target.value)
                }
              />
              {addressSuggestions.length > 0 && (
                <ul className="border-2 border-gray-300 rounded-md mt-2">
                  {addressSuggestions.map((address, index) => (
                    <li
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() =>
                        handleAdditionalInfoChange("privateProvider", address)
                      }
                    >
                      {address}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setIsAdditionalInfoModalOpen(false)}
                className="bg-red-500 text-white px-8 py-2 rounded-full mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleHistorySubmit}
                className="bg-green-500 text-white px-8 py-2 rounded-full"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

{isHistoryModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[60%]">
            <div className="text-center mb-6 text-2xl font-semibold">
              Enter Child History
            </div>
            <div className="flex flex-col my-4">
              <label className="pb-1">Child History</label>
              <textarea
                className="border-2 py-2 px-3 w-full"
                rows="4"
                placeholder="Enter child history here..."
                value={childHistory}
                onChange={(e) => setChildHistory(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setIsHistoryModalOpen(false)}
                className="bg-red-500 text-white px-8 py-2 rounded-full mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleOpenRecommendation }
                className="bg-custom-gradient text-white px-8 py-2 rounded-full"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}



{isRecommendationModalOpen && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
    <div className="bg-white p-8 rounded-lg w-[60%]">
      <div className="text-center mb-6 text-2xl font-semibold">
        Enter Report Recommendation
      </div>
      <div className="flex flex-col my-4">
        <label className="pb-1">Recommendation</label>
        <textarea
          className="border-2 py-2 px-3 w-full"
          rows="4"
          placeholder="Enter report recommendation here..."
          value={reportRecommendation}
          onChange={(e) => setReportRecommendation(e.target.value)}
          required
        ></textarea>
      </div>
      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={() => setIsRecommendationModalOpen(false)}
          className="bg-red-500 text-white px-8 py-2 rounded-full mr-2"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmitAll}
          className="bg-custom-gradient text-white px-8 py-2 rounded-full"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}



    </>
  );
};

export default Buttunpage;
