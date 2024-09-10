import React from "react";
import { Link } from "react-router-dom";

const SignIn = () => {
  return (
    <div className="flex items-center justify-center min-h-screen reltive">
      <img
        src="/Frame 1261153634 (1).jpg"
        alt="side_img"
        className="absolute left-0 hidden md:block w-[30%] h-screen"
      />
      <div className="w-full max-w-md space-y-8 p-6 ">
        <div className="flex justify-center">
          
        </div>

        <h2 className="text-center text-2xl font-medium text-gray-900">
          Sign In
        </h2>

        <form className="mt-8 space-y-6">
          <div className="relative">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <div className="flex items-center border rounded-full  p-2 shadow-md">
              <span className=" pl-3 pr-2">
                <img src="/Frame 33.svg" alt="email" className="w-8 h-8" />
              </span>
              <span>
                <img src="/Line 1.svg" alt="line" />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none focus:outline-none text-gray-700 "
                placeholder="Email"
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="flex items-center border rounded-full  p-2 shadow-md">
              <span className=" pl-3 pr-2">
                <img src="/Frame 34.svg" alt="email" className="w-8 h-8" />
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

          <div className="text-right">
            <a href="#" className="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>

          <div>
            <Link to="/home">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-custom-gradient text-white rounded-full  shadow-lg"
              >
                Sign In
              </button>
            </Link>
          </div>

          <div className="text-center text-sm text-gray-600">
            I Didn’t have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
