import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "../../features/Profile/profileApi";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import toast from "react-hot-toast";

const Profile = () => {
  const { register, handleSubmit, reset } = useForm();
  const { data: profileData, isLoading, error } = useGetUserProfileQuery();
  const [updateUserProfile] = useUpdateUserProfileMutation();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    if (profileData) {
      reset(profileData);
    }
  }, [profileData, reset]);

  const handlePasswordChange = async () => {
    setPasswordError("");
    setPasswordSuccess("");
    setIsUpdatingPassword(true);

    if (!currentPassword || !newPassword) {
      setPasswordError("Please provide both current and new password.");
      setIsUpdatingPassword(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5001/api/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      if (response.ok) {
        setPasswordSuccess("Password changed successfully.");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        const data = await response.json();
        setPasswordError(data.error || "Failed to change password.");
      }
    } catch (error) {
      setPasswordError("An error occurred. Please try again.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const onSubmit = async (profileData) => {
    setIsUpdatingProfile(true);

    try {
      await updateUserProfile(profileData).unwrap();
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile: ", err);
      toast.error("Failed to update profile.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching profile data</div>;

  return (
    <>
      <Header />
      <section className="flex flex-col lg:flex-row justify-between gap-4 h-auto w-full">
        <SideBar />
        <div className="pt-10 w-full lg:w-[75%] xl:w-[80%] 2xl:w-[85%] h-auto">
          <div className="flex flex-col justify-center items-center">
            <div className="w-full max-w-3xl mx-auto flex justify-center items-center flex-col">
              <h2 className="text-2xl font-semibold">Profile</h2>

              <div className="w-full mt-4">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      {...register("firstName")}
                      placeholder="First Name"
                      className="w-full p-3 border rounded mb-4"
                    />
                    <input
                      type="text"
                      {...register("lastName")}
                      placeholder="Last Name"
                      className="w-full p-3 border rounded mb-4"
                    />
                  </div>

                  <input
                    type="email"
                    {...register("email")}
                    placeholder="Email Address"
                    className="w-full p-3 border rounded mb-4"
                  />

                  <div className="flex justify-center mt-4">
                    <button
                      type="submit"
                      className="bg-primary text-white rounded-full py-3 px-32"
                      disabled={isUpdatingProfile}
                    >
                      {isUpdatingProfile ? "Updating..." : "Update Profile"}
                    </button>
                  </div>
                </form>

                {/* Password Change Section */}
                <div className="mt-8 w-full">
                  <h3 className="text-xl font-semibold text-center">Change Password</h3>
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

                  {passwordError && <p className="text-red-500">{passwordError}</p>}
                  {passwordSuccess && <p className="text-green-500">{passwordSuccess}</p>}

                  <div className="flex justify-center mt-4">
                    <button
                      type="button"
                      onClick={handlePasswordChange}
                      className="bg-secondary text-white rounded-full py-3 px-32"
                      disabled={isUpdatingPassword}
                    >
                      {isUpdatingPassword ? "Changing..." : "Change Password"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
