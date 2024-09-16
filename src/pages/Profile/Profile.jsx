import React from "react";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";

const Profile = () => {
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
                <div className="flex space-x-4">
                  <input
                    type="text"
                    name="clinicalPrompt"
                    placeholder="First Name"
                    className="w-full p-3 border rounded mb-4"
                  />

                  <input
                    type="text"
                    name="clinicalPrompt"
                    placeholder="Last Name"
                    className="w-full p-3 border rounded mb-4"
                  />
                </div>

                <input
                  type="text"
                  name="clinicalPrompt"
                  placeholder="User Name"
                  className="w-full p-3 border rounded mb-4"
                />
                <input
                  type="email"
                  name="clinicalPrompt"
                  placeholder="Email Address"
                  className="w-full p-3 border rounded mb-4"
                />
                <input
                  type="text"
                  name="Phone Number"
                  placeholder="Last Name"
                  className="w-full p-3 border rounded mb-4"
                />

                <div className="flex justify-center mt-4">
                  <button className="bg-primary text-white rounded-full py-3 px-32">
                    Edit
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

export default Profile;
