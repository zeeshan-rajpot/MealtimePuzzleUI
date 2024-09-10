import React from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="flex items-center justify-center min-h-screen reltive">
      <img
        src="/Frame 1261153634 (1).jpg"
        alt="side_img"
        className="absolute left-0 hidden md:block w-[35%]"
      />
      <div className="w-full max-w-md space-y-8 p-6 ">
        <div className="flex justify-center">
          <h1 className="text-4xl font-bold text-primary">Logo</h1>
        </div>

        <h2 className="text-center text-2xl font-medium text-gray-900">
          Sign Up
        </h2>

        <form className="mt-8 space-y-6">
          <div className="flex space-x-2">
            <div className="relative w-[48%]">
              <label htmlFor="first_name" className="sr-only">
                First Name
              </label>
              <div className="flex items-center border rounded-full  p-2 shadow-md">
                <span className=" pl-3 pr-2">
                  <img src="/fluent_person-32-light.svg" alt="person"  className="w-6 h-6"/>
                </span>
                <span>
                  <img src="/Line 1.svg" alt="line" />
                </span>
                <input
                  id="first_name"
                  name="first_name"
                  type="first_name"
                  required
                  className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none text-gray-700 w-[48%]"
                  placeholder=" First Name"
                />
              </div>
            </div>
            <div className="relative w-[48%]">
              <label htmlFor="last_name" className="sr-only">
                Last Name
              </label>
              <div className="flex items-center border rounded-full  p-2 shadow-md">
                <span className=" pl-3 pr-2">
                  <img src="/fluent_person-32-light.svg" alt="person"  className="w-6 h-6" />
                </span>
                <span>
                  <img src="/Line 1.svg" alt="line" />
                </span>
                <input
                  id="last_name"
                  name="last_name"
                  type="last_name"
                  required
                  className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none text-gray-700 w-[48%]"
                  placeholder="Last Name"
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <label htmlFor="username" className="sr-only">
              User Name
            </label>
            <div className="flex items-center border rounded-full  p-2 shadow-md">
              <span className=" pl-3 pr-2">
                <img src="/fluent_person-32-light.svg" alt="person" className="w-8 h-8" />
              </span>
              <span>
                <img src="/Line 1.svg" alt="line" />
              </span>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none text-gray-700 "
                placeholder="Username"
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <div className="flex items-center border rounded-full  p-2 shadow-md">
              <span className=" pl-3 pr-2">
                <img src="/Frame 33.svg" alt="email"  className="w-8 h-8" />
              </span>
              <span>
                <img src="/Line 1.svg" alt="line" />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none text-gray-700 "
                placeholder="Email"
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="phone_number" className="sr-only">
              Phone Number
            </label>
            <div className="flex items-center border rounded-full  p-2 shadow-md">
              <span className=" pl-3 pr-2">
                <img src="/ph_phone-thin.svg" alt="phone"  className="w-8 h-8" />
              </span>
              <span>
                <img src="/Line 1.svg" alt="line" />
              </span>
              <input
                id="phone_number"
                name="phone_number"
                type="text"
                required
                className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none text-gray-700 "
                placeholder="Phone Number"
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="flex items-center border rounded-full  p-2 shadow-md">
              <span className=" pl-3 pr-2">
                <img src="/Frame 34.svg" alt="email"  className="w-8 h-8" />
              </span>
              <span>
                <img src="/Line 1.svg" alt="line" />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none text-gray-700"
                placeholder="Password"
              />
              <button type="button" className="text-gray-400 pr-3">
                <img src="/ion_eye-off.svg" alt="eye_icon" />
              </button>
            </div>
          </div>
          <div className="relative">
            <label htmlFor="confirm_password" className="sr-only">
              Password
            </label>
            <div className="flex items-center border rounded-full  p-2 shadow-md">
              <span className=" pl-3 pr-2">
                <img src="/Frame 34.svg" alt="password"  className="w-8 h-8"/>
              </span>
              <span>
                <img src="/Line 1.svg" alt="line" />
              </span>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                required
                className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none text-gray-700"
                placeholder="Confirm Password"
              />
              <button type="button" className="text-gray-400 pr-3">
                <img src="/ion_eye-off.svg" alt="eye_icon" />
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-custom-gradient text-white rounded-full shadow-lg"
            >
              Sign In
            </button>
          </div>

          <div className="text-center text-sm text-gray-600">
            I have a account?{" "}
            <Link
              to="/"
              href="#"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
