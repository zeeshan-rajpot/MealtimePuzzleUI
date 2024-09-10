import React from "react";

const Header = () => {
  return (
    <>
      <div className="flex justify-between  border-b py-4 px-12 ">
        <h1 className="text-4xl font-bold text-primary">Logo</h1>
        <h1 className="text-4xl font-bold text-black hidden sm:block">The Mealtime Puzzle</h1>
        <img src="/Rectangle 149534.svg" alt="profile" />
      </div>
    </>
  );
};

export default Header;
