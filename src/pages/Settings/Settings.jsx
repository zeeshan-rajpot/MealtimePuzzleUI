import React from "react";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";

const Settings = () => {
  return (
    <>
      <Header />
      <section className="flex flex-col lg:flex-row justify-between gap-4 h-auto w-full">
        <SideBar />
        <div className="pt-10 w-full lg:w-[75%] xl:w-[80%] 2xl:w-[85%] h-auto">
          <div className="w-full max-w-3xl mx-auto flex justify-center items-center flex-col">
            <h2 className="text-2xl font-semibold">Settings</h2>
            <div className="w-full mt-4 ">
              <input
                type="password"
                name="clinicalPrompt"
                placeholder="Old Password"
                className="w-full p-3 border rounded mb-4"
              />
              <input
                type="password"
                name="clinicalPrompt"
                placeholder="New Password"
                className="w-full p-3 border rounded mb-4"
              />
              <input
                type="password"
                name="clinicalPrompt"
                placeholder="Confirm Password"
                className="w-full p-3 border rounded mb-4"
              />

              <div className="flex justify-center mt-4">
                <button className="bg-primary text-white rounded-full py-3 px-32">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Settings;
