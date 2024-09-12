import React from "react";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";

const History = () => {
  return (
    <>
      <Header />
      <section className="flex flex-col lg:flex-row justify-between gap-4 h-auto w-full">
        <SideBar />
        <div className="pt-10 w-full lg:w-[75%] xl:w-[80%] 2xl:w-[85%] h-auto">
          <div className="flex flex-col justify-center items-center">
            <h1>History</h1>
          </div>
        </div>
      </section>
    </>
  );
};

export default History;
