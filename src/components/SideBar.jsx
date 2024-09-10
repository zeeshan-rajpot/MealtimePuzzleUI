import { MotionConfig, motion } from "framer-motion";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Home",
    route: "/home",
    activeLogo: "/solar_home-2-broken.svg",
    inactiveLogo: "/solar_home-2-broken (1).svg",
  },
  // {
  //   name: "Users",
  //   route: "/users",
  //   activeLogo: "/solar_user-linear (1).svg",
  //   inactiveLogo: "/solar_user-linear.svg",
  // },
  // {
  //   name: "Program",
  //   route: "/Program",
  //   activeLogo: "/_30-Report (1).svg",
  //   inactiveLogo: " /_30-Report.svg",
  // },
  // {
  //   name: "Tab",
  //   route: "/tab",
  //   activeLogo: "/Frame_active(1).svg",
  //   inactiveLogo: "/Frame_active.svg",
  // },
  {
    name: "Logout",
    route: "/",
    activeLogo: "/solar_logout-2-broken (1).svg",
    inactiveLogo: "/solar_logout-2-broken (1).svg",
  },
];

const SideBar = () => {
  const [active, setActive] = useState(false);

  return (
    <div>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setActive((prev) => !prev)}
        type="button"
        className="inline-flex items-center  mt-2 text-sm text-gray-500 rounded-lg lg:hidden focus:outline-none focus:ring-2 focus:ring-gray-200"
        style={{
          position: "absolute",
          right: "10px",
          top: "25px",
        }}
      >
        <MotionConfig
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
        >
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
        className={`bg-custom-gradient left-0 z-40 w-60 h-full transition-transform  rounded-tr-[5rem] ${
          active ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        aria-label="Sidebar"
      >
        <div
          className="h-full px-3 py-4 overflow-y-auto bg-transparent "
          style={{ borderRadius: "0px 40px 0px 0px" }}
        >
          <ul className="space-y-2 font-medium mt-16">
            {menuItems.map((item) => (
              <li key={item.route} style={{ padding: "0px 16px 0px 16px" }}>
                <NavLink
                  to={item.route}
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center my-4 p-2 rounded-lg text-primary bg-white "
                      : "flex items-center my-4 p-2 rounded-lg text-white"
                  }
                >
                  {({ isActive }) => (
                    <>
                      <img
                        src={isActive ? item.activeLogo : item.inactiveLogo}
                        alt={`${item.name} logo`}
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
    open: {
      rotate: ["0deg", "0deg", "45deg"],
      top: ["35%", "50%", "50%"],
    },
    closed: {
      rotate: ["45deg", "0deg", "0deg"],
      top: ["50%", "50%", "35%"],
    },
  },
  middle: {
    open: {
      rotate: ["0deg", "0deg", "-45deg"],
    },
    closed: {
      rotate: ["-45deg", "0deg", "0deg"],
    },
  },
  bottom: {
    open: {
      rotate: ["0deg", "0deg", "45deg"],
      bottom: ["35%", "50%", "50%"],
      left: "50%",
    },
    closed: {
      rotate: ["45deg", "0deg", "0deg"],
      bottom: ["50%", "50%", "35%"],
      left: "calc(50% + 10px)",
    },
  },
};

export default SideBar;
