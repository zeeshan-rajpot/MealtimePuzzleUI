import {React, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useLoginUserMutation } from "../../features/auth/authApi";
const SignIn = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const [loginUser, { isLoading, isError, error }] = useLoginUserMutation();

  const onSubmit = async (data) => {
    try {
     const response =  await loginUser(data).unwrap();
      localStorage.setItem('token', response.token);
      navigate("/home");
    } catch (err) {
      console.error("Failed to login:", err);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen relative">
      <img
        src="/Frame 1261153634 (1).jpg"
        alt="side_img"
        className="absolute left-0 hidden md:block w-[30%] h-screen"
      />
      <div className="w-full max-w-md space-y-8 p-6">
        <div className="flex justify-center"></div>

        <h2 className="text-center text-2xl font-medium text-gray-900">
          Sign In
        </h2>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="relative">
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <div className="flex items-center border rounded-full p-2 shadow-md">
              <span className="pl-3 pr-2">
                <img src="/Frame 33.svg" alt="email" className="w-8 h-8" />
              </span>
              <span>
                <img src="/Line 1.svg" alt="line" />
              </span>
              <input
                id="username"
                name="username"
                type="username"
                {...register("username", { required: true })}
                className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none text-gray-700"
                placeholder="Username"
              />
            </div>
            {errors.email && (
              <span className="text-red-500">Email is required</span>
            )}
          </div>

          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="flex items-center border rounded-full p-2 shadow-md">
              <span className="pl-3 pr-2">
                <img src="/Frame 34.svg" alt="pass" className="w-8 h-8" />
              </span>
              <span>
                <img src="/Line 1.svg" alt="line" />
              </span>
              <input
                id="password"
                name="password"
                type={isPasswordVisible ? "text" : "password"}
                {...register("password", { required: true })}
                className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none text-gray-700"
                placeholder="Password"
              />
              <button type="button" className="text-gray-400 pr-3" onClick={togglePasswordVisibility}>
                <img src="/ion_eye-off.svg" alt="eye_icon" />
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500">Password is required</span>
            )}
          </div>

          <div className="text-right">
            <a href="#" className="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-custom-gradient text-white rounded-full shadow-lg"
            >
              {isLoading ? " Sign in..." : " Sign In"}
            </button>
          </div>

          {isError && (
            <p className="text-red-500">
              {error?.data?.error || "Error during login"}
            </p>
          )}

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
