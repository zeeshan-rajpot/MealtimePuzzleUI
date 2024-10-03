import React from "react";

const Header = () => {
  return (
    <>
      <div className="flex justify-between items-center border-b py-4 px-12 ">
        <img src="/CDS Logo.PNG" alt="logo" className="w-28" />
        <h1 className="text-4xl font-bold text-black hidden sm:block">
          The Mealtime Puzzle
        </h1>
        <img src="/Rectangle 149534.svg" alt="profile" />
      </div>
    </>
  );
};

export default Header;
