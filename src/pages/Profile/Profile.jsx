import React, { useState, useEffect } from "react";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import axios from "axios";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage (or wherever it is stored)
  
      try {
        const response = await axios.get("http://localhost:5001/api/user-details", {
          headers: {
            Authorization: `Bearer ${token}` // Add the token in the Authorization header
          }
        });
        setProfileData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch user details");
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  // Handle form submit for profile update
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Retrieve the token
  
    try {
      const response = await axios.post(
        "http://localhost:5001/api/update-profile",
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}` // Add the token in the Authorization header
          }
        }
      );
      alert("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Header />
      <section className="flex flex-col lg:flex-row justify-between gap-4 h-auto w-full">
        <SideBar />
        <div className="pt-10 w-full lg:w-[75%] xl:w-[80%] 2xl:w-[85%] h-auto">
          <div className="flex flex-col justify-center items-center">
            <div className="w-full max-w-3xl mx-auto flex justify-center items-center flex-col">
              <h2 className="text-2xl font-semibold">Profile</h2>

              <div className="w-full mt-4 ">
                <form onSubmit={handleFormSubmit}>
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      placeholder="First Name"
                      className="w-full p-3 border rounded mb-4"
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                      className="w-full p-3 border rounded mb-4"
                    />
                  </div>

                  <input
                    type="text"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    className="w-full p-3 border rounded mb-4"
                  />
                  <input
                    type="text"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    className="w-full p-3 border rounded mb-4"
                  />

                  <div className="flex justify-center mt-4">
                    <button
                      type="submit"
                      className="bg-primary text-white rounded-full py-3 px-32"
                    >
                      Edit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
