import { MotionConfig, motion } from "framer-motion";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Home",
    route: "/home",
    activeLogo: "/icon-home-active.svg",
    inactiveLogo: "/icon-home-inactive.svg",
    hoverLogo: "/icon-home-hover.svg",
  },
  {
    name: "History",
    route: "/history",
    activeLogo: "/icon-history-active.svg",
    inactiveLogo: "/icon-history-inactive.svg",
    hoverLogo: "/icon-history-hover.svg",
  },
  {
    name: "Profile",
    route: "/profile",
    activeLogo: "/icon-profile-active.svg",
    inactiveLogo: "/icon-profile-inactive.svg",
    hoverLogo: "/icon-profile-hover.svg",
  },
  {
    name: "Assessment",
    route: "/intervention",
    activeLogo: "/icon-assessment-active.svg",
    inactiveLogo: "/icon-assessment-inactive.svg",
    hoverLogo: "/icon-assessment-hover.svg",
  },
  {
    name: "Logout",
    route: "/",
    activeLogo: "/icon-logout-active.svg",
    inactiveLogo: "/icon-logout-inactive.svg",
    hoverLogo: "/icon-logout-hover.svg",
  },
];

const SideBar = () => {
  const [active, setActive] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null); // State for tracking hovered item

  return (
    <div>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setActive((prev) => !prev)}
        type="button"
        className="inline-flex items-center mt-2 text-sm text-gray-500 rounded-lg lg:hidden focus:outline-none focus:ring-2 focus:ring-gray-200"
        style={{
          position: "absolute",
          right: "10px",
          top: "25px",
        }}
      >
        <MotionConfig transition={{ duration: 0.5, ease: "easeInOut" }}>
          <motion.button
            initial={false}
            animate={active ? "open" : "closed"}
            className="relative h-20 w-20 rounded-full bg-white/0 transition-colors hover:bg-white/20"
          >
            <motion.span
              variants={VARIANTS.top}
              className="absolute h-1 w-10 bg-[#FF2800]"
              style={{ y: "-50%", left: "50%", x: "-50%", top: "35%" }}
            />
            <motion.span
              variants={VARIANTS.middle}
              className="absolute h-1 w-10 bg-[#FF2800]"
              style={{ left: "50%", x: "-50%", top: "50%", y: "-50%" }}
            />
            <motion.span
              variants={VARIANTS.bottom}
              className="absolute h-1 w-5 bg-[#FF2800]"
              style={{
                x: "-50%",
                y: "50%",
                bottom: "35%",
                left: "calc(50% + 10px)",
              }}
            />
          </motion.button>
        </MotionConfig>
      </button>

      {/* Sidebar */}
      <aside
        id="default-sidebar"
        className={`bg-deepSkyBlue left-0 z-40 w-60 h-full transition-transform rounded-tr-[5rem] ${
          active ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="pl-4 py-4 overflow-y-auto bg-transparent h-screen">
          <ul className="space-y-2 font-medium mt-16">
            {menuItems.map((item) => (
              <li
                key={item.route}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <NavLink
                  to={item.route}
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center my-4 p-2 text-ceruleanBlue bg-white rounded-l-full"
                      : "group flex items-center my-4 p-2 text-white hover:bg-white hover:text-blushPink transition duration-300 rounded-l-full"
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Display appropriate icon based on active, hover, and inactive states */}
                      <img
                        src={
                          isActive
                            ? item.activeLogo // Show active logo
                            : hoveredItem === item.name
                            ? item.hoverLogo // Show hover logo if hovered
                            : item.inactiveLogo // Show inactive logo otherwise
                        }
                        alt={`${item.name} logo`}
                        className="icon"
                        onError={(e) => {
                          console.error(`Failed to load image: ${e.target.src}`);
                          e.target.src = "/fallback-icon.svg"; // Optional fallback icon
                        }}
                      />
                      <span className="ms-3">{item.name}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
};

const VARIANTS = {
  top: {
    open: { rotate: ["0deg", "0deg", "45deg"], top: ["35%", "50%", "50%"] },
    closed: { rotate: ["45deg", "0deg", "0deg"], top: ["50%", "50%", "35%"] },
  },
  middle: {
    open: { rotate: ["0deg", "0deg", "-45deg"] },
    closed: { rotate: ["-45deg", "0deg", "0deg"] },
  },
  bottom: {
    open: { rotate: ["0deg", "0deg", "45deg"], bottom: ["35%", "50%", "50%"], left: "50%" },
    closed: { rotate: ["45deg", "0deg", "0deg"], bottom: ["50%", "50%", "35%"], left: "calc(50% + 10px)" },
  },
};

export default SideBar;
