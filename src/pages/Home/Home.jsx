import React from "react";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <Header />
      <section className="flex flex-col lg:flex-row justify-between gap-4 h-auto w-full">
        <SideBar />
        <div className="pt-10 w-full lg:w-[75%] xl:w-[80%] 2xl:w-[85%] h-auto">
          <div className="flex flex-col justify-center items-center">
            <img src="/Asset 1 1.jpg" alt="asset" />
            <Link to="/home/options">
              <button className=' className="w-full py-3 px-10 bg-custom-gradient text-white rounded-full  shadow-lg my-8'>
                {" "}
                Add New Assessments{" "}
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
