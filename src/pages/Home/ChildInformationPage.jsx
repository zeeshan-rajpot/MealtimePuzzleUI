import React, { useState } from "react";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { Link } from "react-router-dom";
import axios from "axios"; // Add axios for API requests

const ChildInformationPage = () => {
  const [formData, setFormData] = useState({
    urn: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "", // Use this field name to match the JSON from Postman
    parentName: "",
    contactEmail: "", // Use this field name to match the JSON from Postman
    contactPhone: "", // Use this field name to match the JSON from Postman
    finnumber: "",
    gender: ""
  });

  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNext = async () => {
    const token = localStorage.getItem("token"); // Retrieve the token
    try {
      const response = await axios.post("http://localhost:5001/api/child", formData, {
        headers: {
          Authorization: `Bearer ${token}` // Add the token in the Authorization header
        }
      });
      alert("Child information submitted successfully!");
    } catch (error) {
      setError("Failed to submit child information.");
    }
  };

  return (
    <>
      <Header />
      <section className="flex flex-col lg:flex-row justify-between gap-4 h-auto w-full">
        <SideBar />
        <div className="pt-10 w-full lg:w-[75%] xl:w-[80%] 2xl:w-[85%] h-auto">
          <div className="flex mt-4">
            <img src="/ion_chevron-back.svg" alt="back_arrow" />
            <button className="text-base">Back</button>
          </div>
          <div className="w-full max-w-3xl mx-auto flex justify-center items-center flex-col">
            <h2 className="text-2xl font-semibold">Child Information</h2>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="w-full mt-4 ">
              <input
                type="text"
                name="urn"
                placeholder="Child's URN (Unit Record Number)"
                className="w-full p-3 border rounded mb-4"
                value={formData.urn}
                onChange={handleInputChange}
              />

              <div className="flex space-x-3">
                <input
                  type="text"
                  name="firstName"
                  placeholder="Child First Name"
                  className="w-full p-3 border rounded mb-4"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Child Last Name"
                  className="w-full p-3 border rounded mb-4"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex space-x-3">
                <input
                  type="date"
                  name="dateOfBirth" // Match the JSON field name
                  placeholder="Date of Birth"
                  className="w-full p-3 border rounded mb-4"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="parentName"
                  placeholder="Parent/Caretaker Name"
                  className="w-full p-3 border rounded mb-4"
                  value={formData.parentName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex space-x-3">
                <input
                  type="text"
                  name="contactEmail" // Match the JSON field name
                  placeholder="Parent/Caretaker Email Address"
                  className="w-full p-3 border rounded mb-4"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="contactPhone" // Match the JSON field name
                  placeholder="Parent/Caretaker Contact Number"
                  className="w-full p-3 border rounded mb-4"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex space-x-3">
                <input
                  type="text"
                  name="gender"
                  placeholder="Child Gender"
                  className="w-full p-3 border rounded mb-4"
                  value={formData.gender}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="finnumber"
                  placeholder="Child FIN Number"
                  className="w-full p-3 border rounded mb-4"
                  value={formData.finnumber}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex justify-center mt-4">
                {/* <Link to="/home/options"> */}
                  <button
                    className="bg-primary text-white rounded-full py-3 px-32"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                {/* </Link> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChildInformationPage;
