import React from "react";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";

const ChildInformationPage = () => {
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

            <div className="w-full mt-4 ">
              <input
                type="text"
                name="clinicalPrompt"
                placeholder="child's URN(Unit Record Number)?"
                className="w-full p-3 border rounded mb-4"
              />

              <div className="flex space-x-3">
                <input
                  type="text"
                  name="clinicalPrompt"
                  placeholder="Child First Name"
                  className="w-full p-3 border rounded mb-4"
                />
                <input
                  type="text"
                  name="clinicalPrompt"
                  placeholder="Child Last Name"
                  className="w-full p-3 border rounded mb-4"
                />
              </div>

              <div className="flex space-x-3">
                <input
                  type="text"
                  name="clinicalPrompt"
                  placeholder="Parent/Caretaker Name"
                  className="w-full p-3 border rounded mb-4"
                />
                <input
                  type="date"
                  name="clinicalPrompt"
                  placeholder="DD/MM/YYYY"
                  className="w-full p-3 border rounded mb-4"
                />
              </div>

              <input
                type="text"
                name="clinicalPrompt"
                placeholder="Parent/Caretaker Email Address"
                className="w-full p-3 border rounded mb-4"
              />

              <input
                type="text"
                name="clinicalPrompt"
                placeholder="Parent/Caretaker Contact Number"
                className="w-full p-3 border rounded mb-4"
              />

              <div className="flex justify-center mt-4">
                <button className="bg-primary text-white rounded-full py-3 px-32">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChildInformationPage;
