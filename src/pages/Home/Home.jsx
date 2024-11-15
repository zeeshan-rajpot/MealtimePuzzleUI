import React from "react";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <Header />
      <section className="flex flex-col lg:flex-row justify-between gap-4 h-auto w-full">
        {/* Sidebar with background color */}
        <SideBar className="bg-deepSkyBlue text-white" />

        <div className="pt-10 w-full lg:w-[75%] xl:w-[80%] 2xl:w-[85%] h-auto">
          <div className="flex flex-col justify-center items-center">
            <Link to="/home/childinfo">
              <img 
                src="/pyramid1.png" 
                alt="Home Asset" 
                className="w-full md:w-[50%] mx-auto cursor-pointer" 
                aria-label="Navigate to Create New Child"
              />
            </Link>
            <Link to="/home/childinfo">
              <button 
                className="w-full py-3 px-10 bg-ceruleanBlue text-white rounded-full shadow-lg my-8 hover:bg-blushPink transition duration-300"
                aria-label="Create New Child"
              >
                Create New Child
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
