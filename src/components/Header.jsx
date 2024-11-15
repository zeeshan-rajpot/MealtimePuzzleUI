import React from "react";

// Header component for the application's layout
const Header = () => {
  return (
    <>
      <div className="flex justify-between items-center border-b py-4 px-12">
        {/* Logo */}
        <img src="/GCH Logo.png" alt="logo" className="w-32" />

        {/* Title (only visible on small screens and up) */}
        <h1 className="text-4xl font-bold text-black hidden sm:block">
          Digital Mealtime Puzzle
        </h1>

        {/* Placeholder for future content or icons */}
        <div></div>
        
        {/* Optional Profile Image */}
        {/* <img src="/Rectangle 149534.svg" alt="profile" /> */}
      </div>
    </>
  );
};

export default Header;
