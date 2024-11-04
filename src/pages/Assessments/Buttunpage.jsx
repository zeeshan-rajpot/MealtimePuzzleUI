import React, { useEffect, useState, useCallback } from "react";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate} from "react-router-dom";
import { debounce } from "lodash";

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
    unitingCare: false, // Add checkbox state
  });
  
  const [suggestions, setSuggestions] = useState({
    parents: [],
    referrer: [],
    gp: [],
    privateProvider: []
  });
  
  const [isLoading, setIsLoading] = useState({
    parents: false,
    referrer: false,
    gp: false,
    privateProvider: false
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

  const debouncedFetchAddressSuggestions = useCallback(
    debounce(async (query, field) => {
      if (query.length < 3) {
        setSuggestions((prev) => ({ ...prev, [field]: [] }));
        return;
      }
  
      setIsLoading((prev) => ({ ...prev, [field]: true }));
      try {
        const response = await axios.post("http://localhost:5001/api/address-autocomplete", {
          query, // Send the query in the body as shown in the screenshot
        }, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        // Log the response structure for debugging
        console.log(`Response for field "${field}":`, response);
  
        const addresses = response.data.suggestions || []; // Ensure suggestions is an array
        setSuggestions((prev) => ({
          ...prev,
          [field]: Array.isArray(addresses) ? addresses.slice(0, 5) : [],
        }));
      } catch (error) {
        console.error(`Error fetching address suggestions for ${field}:`, error);
      } finally {
        setIsLoading((prev) => ({ ...prev, [field]: false }));
      }
    }, 300),
    [token]
  );
  
  
  
const handleAddressChange = (field, value) => {
  setAdditionalInfo((prev) => ({
    ...prev,
    [field]: value,
  }));
  debouncedFetchAddressSuggestions(value, field);
};

const applySuggestion = (field, suggestion) => {
  setAdditionalInfo((prev) => ({
    ...prev,
    [field]: suggestion,
  }));
  setSuggestions((prev) => ({ ...prev, [field]: [] })); // Clear suggestions after selection
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



  const handleOpenRecommendation = async () => {
    console.log("Next button clicked, child history:", childHistory);
  
    if (childHistory.trim() === '') {
      alert('Please enter the child history before proceeding.');
      return;
    }
  
    try {
      const response = await axios.post(
        `http://localhost:5001/api/child/update-history/${urn}`,
        { childHistory },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("API response for child history update:", response);
  
      if (response.status === 200) {
        console.log("Child history updated successfully. Transitioning to recommendation modal.");
        
        // Close history modal and open recommendation modal
        setIsHistoryModalOpen(false);
        setIsRecommendationModalOpen(true);
  
        // Debugging state change
        console.log("isHistoryModalOpen:", isHistoryModalOpen, "isRecommendationModalOpen:", isRecommendationModalOpen);
      } else {
        console.error("Unexpected response status:", response.status);
        alert("Failed to update child history. Please try again.");
      }
    } catch (error) {
      console.error('Error updating child history:', error);
      alert(error.response?.data?.message || 'Failed to update child history');
    }


    // Close modal after saving

  };
  const navigate = useNavigate();

const handleSubmitAll = async()=>{
  try {
    const response = await axios.post(
      `http://localhost:5001/api/child/update-recommendation/${urn}`,
      { RecommendationChild: reportRecommendation },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
 navigate(`/home/detailpage/${urn}/${totalSessions}`);

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
                <button onClick={handleNextClick} className="w- py-3 px-10 bg-ceruleanBlue text-white rounded-full shadow-lg my-8 hover:bg-blushPink transition duration-300">
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
        <button
  onClick={() => setShowInputs(true)}
  className="bg-[#006699] text-white px-4 py-2 rounded-lg hover:bg-[#003c68] transition"
>
  Add New Member
</button>

      </div>

      {showInputs && (
  <>
    <div className="input-container">
      <input
        className="border border-gray-300 py-4 px-5 w-full rounded-md focus:outline-none"
        type="text"
        placeholder=" "  // Keeps the input space for floating label
        value={newMember.username}
        onChange={(e) => handleNewMemberChange("username", e.target.value)}
        required
      />
      <label
        className={`absolute left-5 top-4 bg-white px-1 text-gray-500 transition-all duration-300 ${
          newMember.username ? "top-[-10px] text-xs text-[#006699]" : ""
        }`}
      >
        Name
      </label>
    </div>

    <div className="input-container">
      <input
        className="border border-gray-300 py-4 px-5 w-full rounded-md focus:outline-none"
        type="text"
        placeholder=" "
        value={newMember.role}
        onChange={(e) => handleNewMemberChange("role", e.target.value)}
        required
      />
      <label
        className={`absolute left-5 top-4 bg-white px-1 text-gray-500 transition-all duration-300 ${
          newMember.role ? "top-[-10px] text-xs text-[#006699]" : ""
        }`}
      >
        Role
      </label>
    </div>

    <div className="flex justify-center space-x-4 mt-6">
      <button
        onClick={() => setShowInputs(false)}
        className="bg-[#BB6F7A] text-white px-8 py-2 rounded-full hover:bg-[#A25666] transition"
      >
        Close
      </button>
      <button
        onClick={handleAddMember}
        className="bg-[#006699] text-white px-8 py-2 rounded-full hover:bg-[#003c68] transition"
      >
        Add
      </button>
    </div>
  </>
)}



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
              {/* Add new members from sessionStorage */}
              {members
                .filter((m) => m.isNew)
                .map((m, idx) => (
                  <option key={`new-${idx}`} value={m.username}>
                    {m.username}
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
  className="bg-[#006699] text-white px-4 py-2 rounded-lg hover:bg-[#003c68] transition"
>
  + Add Existing User
</button>

      </div>
      <div className="mt-8 flex justify-center space-x-4">
      <button
  type="button"
  onClick={() => setIsAssessmentModalOpen(false)}
  className="bg-[#BB6F7A] text-white px-8 py-2 rounded-full hover:bg-[#A25666] transition"
>
  Cancel
</button>

<button
  onClick={handleSaveAdditionalInfo}
  className="bg-[#006699] text-white px-8 py-2 rounded-full hover:bg-[#003c68] transition"
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

      {/* Address Inputs with Floating Labels and Suggestions */}
      {["parents", "referrer", "gp", "privateProvider"].map((field) => (
        <div key={field} className="input-container my-4">
          <input
            className="border border-gray-300 py-4 px-5 w-full rounded-md focus:outline-none"
            type="text"
            placeholder=" "  // Placeholder space for floating label
            value={additionalInfo[field]}
            onChange={(e) => handleAddressChange(field, e.target.value)}
          />
          <label
            className={`absolute left-5 top-4 bg-white px-1 text-gray-500 transition-all duration-300 ${
              additionalInfo[field] ? "top-[-10px] text-xs text-[#006699]" : ""
            }`}
          >
            {field.charAt(0).toUpperCase() + field.slice(1)}'s Address
          </label>
          {isLoading[field] && <p className="text-sm text-gray-500">Loading suggestions...</p>}
          {suggestions[field].length > 0 && (
            <ul className="border border-gray-300 mt-2 rounded-md">
              {suggestions[field].map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => applySuggestion(field, suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {/* Uniting Care Checkbox */}
      <div className="flex items-center my-4">
        <input
          type="checkbox"
          id="unitingCareCheckbox"
          className="mr-2"
          checked={additionalInfo.unitingCare}
          onChange={(e) =>
            setAdditionalInfo((prev) => ({
              ...prev,
              unitingCare: e.target.checked,
            }))
          }
        />
        <label htmlFor="unitingCareCheckbox" className="font-medium">
          Uniting Care
        </label>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => setIsAdditionalInfoModalOpen(false)}
          className="bg-[#BB6F7A] text-white px-8 py-2 rounded-full hover:bg-[#A25666] transition mr-2"
        >
          Cancel
        </button>
        <button
          onClick={handleHistorySubmit}
          className="bg-[#006699] text-white px-8 py-2 rounded-full hover:bg-[#003c68] transition"
        >
          Next
        </button>
      </div>
    </div>
  </div>
)}



{isHistoryModalOpen && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
    <div className="bg-white p-16 rounded-xl w-full max-w-5xl mx-6 shadow-lg">
      <h2 className="text-center mb-8 text-4xl font-semibold text-gray-800">
        Enter Child History
      </h2>
      <div className="relative flex flex-col mb-6 input-container">
        <textarea
          className="border border-gray-300 py-4 px-5 pt-6 w-full rounded-lg text-gray-800 text-lg focus:outline-none focus:border-blue-500 resize-none"
          rows="8"
          placeholder=" "
          value={childHistory}
          onChange={(e) => setChildHistory(e.target.value)}
          required
        ></textarea>
        <label
          className={`absolute left-5 top-4 text-xl font-medium text-gray-500 bg-white px-1 transition-all duration-300 
            ${childHistory ? '-translate-y-6 scale-90 text-blue-500' : ''}`}
        >
          Child History
        </label>
      </div>
      <div className="mt-10 flex justify-center space-x-8">
      <button
  type="button"
  onClick={() => setIsHistoryModalOpen(false)}
  className="bg-[#BB6F7A] text-white px-12 py-3 rounded-full text-xl font-semibold hover:bg-[#A25666] transition"
>
  Cancel
</button>
<button
  onClick={handleOpenRecommendation}
  className="bg-[#006699] text-white px-12 py-3 rounded-full text-xl font-semibold hover:bg-[#003c68] transition"
>
  Next
</button>

      </div>
    </div>
  </div>
)}

{isRecommendationModalOpen && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
    <div className="bg-white p-16 rounded-xl w-full max-w-5xl mx-6 shadow-lg">
      <h2 className="text-center mb-8 text-4xl font-semibold text-gray-800">
        Enter Report Recommendation
      </h2>
      <div className="relative flex flex-col mb-6 input-container">
        <textarea
          className="border border-gray-300 py-4 px-5 pt-6 w-full rounded-lg text-gray-800 text-lg focus:outline-none focus:border-blue-500 resize-none"
          rows="8"
          placeholder=" "
          value={reportRecommendation}
          onChange={(e) => setReportRecommendation(e.target.value)}
          required
        ></textarea>
        <label
          className={`absolute left-5 top-4 text-xl font-medium text-gray-500 bg-white px-1 transition-all duration-300 
            ${reportRecommendation ? '-translate-y-6 scale-90 text-blue-500' : ''}`}
        >
          Recommendation
        </label>
      </div>
      <div className="mt-10 flex justify-center space-x-8">
      <button
  type="button"
  onClick={() => setIsRecommendationModalOpen(false)}
  className="bg-[#BB6F7A] text-white px-12 py-3 rounded-full text-xl font-semibold hover:bg-[#A25666] transition"
>
  Cancel
</button>
<button
  onClick={handleSubmitAll}
  className="bg-[#006699] text-white px-12 py-3 rounded-full text-xl font-semibold hover:bg-[#003c68] transition"
>
  Generate Report
</button>


      </div>
    </div>
  </div>
)}







    </>
  );
};

export default Buttunpage;
