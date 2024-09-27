import React, { useEffect } from "react";
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

  useEffect(() => {
    if (profileData) {
      reset(profileData);
    }
  }, [profileData, reset]);

  const onSubmit = async (profileData) => {
    try {
      await updateUserProfile(profileData).unwrap();
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile", err);
      toast.error("Failed to update profile");
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

              <div className="w-full mt-4 ">
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
                  <input
                    type="text"
                    {...register("phone")}
                    placeholder="Phone Number"
                    className="w-full p-3 border rounded mb-4"
                  />

                  <div className="flex justify-center mt-4">
                    <button
                      type="submit"
                      className="bg-primary text-white rounded-full py-3 px-32"
                    >
                      {isLoading ? isLoading : "Update"}
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
