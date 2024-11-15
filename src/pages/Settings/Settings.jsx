import React, { useState } from "react";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";

const Settings = () => {
  // State variables for storing passwords and feedback messages
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle password change submission
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Send request to change the password
      const response = await fetch(
        "http://localhost:5001/api/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in localStorage
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      // Handle response from the server
      if (response.ok) {
        setSuccess("Password changed successfully.");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to change password.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
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
              <h2 className="text-2xl font-semibold">Settings</h2>

              {/* Password Change Form */}
              <div className="w-full max-w-lg mt-8">
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 border rounded mb-4"
                />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 border rounded mb-4"
                />

                {/* Display success or error messages */}
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}

                <div className="flex justify-center mt-4">
                  <button
                    onClick={handlePasswordChange}
                    className="bg-primary text-white rounded-full py-3 px-32"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Settings;
