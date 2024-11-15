import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useLoginUserMutation } from "../../features/auth/authApi";
import toast from "react-hot-toast";

const SignIn = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Track password visibility

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const [loginUser, { isLoading, isError, error }] = useLoginUserMutation();

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data).unwrap(); // Trigger login API call
      localStorage.setItem("token", response.token); // Store token in local storage
      navigate("/home"); // Redirect on successful login
      reset(); // Reset form inputs
      toast.success("Login Successful");
    } catch (err) {
      // Handle login error with appropriate feedback
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative">
      {/* Background image on the left for larger screens */}
      <img
        src="/Frame 1261153634 (1).jpg"
        alt="side_img"
        className="absolute left-0 hidden md:block w-[30%] h-screen"
      />

      <div className="w-full max-w-md space-y-8 p-6">
        {/* Center logo */}
        <img src="/GCH Logo.png" alt="" className="w-[50%] mx-auto" />

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Username Field */}
          <div className="relative input-container">
            <input
              id="username"
              name="username"
              type="text"
              {...register("username", { required: true })}
              className="peer w-full px-4 py-2 rounded-full bg-transparent outline-none border border-ceruleanBlue focus:border-blushPink placeholder-transparent"
              placeholder=" "
            />
            <label
              htmlFor="username"
              className="absolute left-4 top-2 text-gray-500 transition-all duration-200 transform -translate-y-1/2 scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:scale-75 peer-focus:text-ceruleanBlue"
            >
              Username
            </label>
            {errors.username && (
              <span className="text-red-500">Username is required</span>
            )}
          </div>

          {/* Password Field */}
          <div className="relative input-container">
            <input
              id="password"
              name="password"
              type={isPasswordVisible ? "text" : "password"}
              {...register("password", { required: true })}
              className="peer w-full px-4 py-2 rounded-full bg-transparent outline-none border border-ceruleanBlue focus:border-blushPink placeholder-transparent"
              placeholder=" "
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-2 text-gray-500 transition-all duration-200 transform -translate-y-1/2 scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:scale-75 peer-focus:text-ceruleanBlue"
            >
              Password
            </label>
            {/* Toggle password visibility icon */}
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              onClick={togglePasswordVisibility}
            >
              <img src="/ion_eye-off.svg" alt="eye_icon" />
            </button>
            {errors.password && (
              <span className="text-red-500">Password is required</span>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-ceruleanBlue text-white rounded-full shadow-lg hover:bg-blushPink"
            >
              {isLoading ? " Signing in..." : " Sign In"}
            </button>
          </div>

          {/* Display error message on unsuccessful login */}
          {isError && (
            <p className="text-red-500">
              {error?.data?.error || "Error during login"}
            </p>
          )}

          {/* Link to sign-up page */}
          <div className="text-center text-sm text-gray-600">
            I Didn’t have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-ceruleanBlue hover:underline"
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
