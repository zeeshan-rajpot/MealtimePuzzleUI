import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSignupUserMutation } from "../../features/auth/authApi";
import toast from "react-hot-toast";

const SignUp = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const [signupUser, { isLoading, isError, error }] = useSignupUserMutation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  // Handle form submission
  const onSubmit = async (userData) => {
    try {
      const { confirmPassword, ...rest } = userData; // Remove confirmPassword for the API call
      await signupUser(rest).unwrap();
      toast.success("New User Created");
      navigate("/");
      reset();
    } catch (err) {
      toast.error("SignUp Failed");
    }
  };

  // Toggle visibility of password fields
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative">
      {/* Sidebar image for larger screens */}
      <img
        src="/Frame 1261153634 (1).jpg"
        alt="side_img"
        className="absolute left-0 hidden md:block w-[35%]"
      />

      <div className="w-full max-w-md space-y-8 p-6">
        {/* Center logo */}
        <div className="flex justify-center">
          <img src="/GCH Logo.png" alt="" className="w-[50%] mx-auto" />
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* First Name and Last Name Fields */}
          <div className="flex space-x-2">
            <div className="relative w-[48%] input-container">
              <input
                id="first_name"
                {...register("firstName", {
                  required: "First Name is required",
                  minLength: {
                    value: 2,
                    message: "Must be at least 2 characters",
                  },
                  maxLength: {
                    value: 20,
                    message: "Cannot exceed 20 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z]+$/,
                    message: "Alphabetical characters only",
                  },
                })}
                className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none border-ceruleanBlue focus:border-blushPink"
                placeholder=" "
              />
              <label
                htmlFor="first_name"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all duration-200"
              >
                First Name
              </label>
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="relative w-[48%] input-container">
              <input
                id="last_name"
                {...register("lastName", {
                  required: "Last Name is required",
                  minLength: {
                    value: 2,
                    message: "Must be at least 2 characters",
                  },
                  maxLength: {
                    value: 20,
                    message: "Cannot exceed 20 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z]+$/,
                    message: "Alphabetical characters only",
                  },
                })}
                className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none border-ceruleanBlue focus:border-blushPink"
                placeholder=" "
              />
              <label
                htmlFor="last_name"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all duration-200"
              >
                Last Name
              </label>
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Username Field */}
          <div className="relative input-container">
            <input
              id="username"
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 4,
                  message: "Username must be at least 4 characters",
                },
                pattern: {
                  value: /^[A-Za-z0-9_]+$/,
                  message: "Only alphanumeric and underscores allowed",
                },
              })}
              className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none border-ceruleanBlue focus:border-blushPink"
              placeholder=" "
            />
            <label
              htmlFor="username"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all duration-200"
            >
              Username
            </label>
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="relative input-container">
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none border-ceruleanBlue focus:border-blushPink"
              placeholder=" "
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all duration-200"
            >
              Email
            </label>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="relative input-container">
            <input
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none border-ceruleanBlue focus:border-blushPink"
              placeholder=" "
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all duration-200"
            >
              Password
            </label>
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              onClick={togglePasswordVisibility}
            >
              <img src="/ion_eye-off.svg" alt="eye_icon" />
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="relative input-container">
            <input
              id="confirm_password"
              type={isConfirmPasswordVisible ? "text" : "password"}
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none border-ceruleanBlue focus:border-blushPink"
              placeholder=" "
            />
            <label
              htmlFor="confirm_password"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all duration-200"
            >
              Confirm Password
            </label>
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              onClick={toggleConfirmPasswordVisibility}
            >
              <img src="/ion_eye-off.svg" alt="eye_icon" />
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Role Selection */}
          <div className="relative input-container">
            <select
              id="role"
              {...register("role", { required: "Role is required" })}
              className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none border-ceruleanBlue focus:border-blushPink"
            >
              <option value="">Select Role</option>
              <option value="Psychologist">Psychologist</option>
              <option value="Speech Pathologist">Speech Pathologist</option>
              <option value="Occupational Therapist">Occupational Therapist</option>
              <option value="Paediatric Dietitian">Paediatric Dietitian</option>
              <option value="Paediatrician">Paediatrician</option>
            </select>
            <label
              htmlFor="role"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all duration-200"
            >
              Select Role
            </label>
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full p-3 rounded-full bg-ceruleanBlue text-white ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blushPink transition duration-300"
              }`}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        </form>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <Link to="/" className="text-ceruleanBlue hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
