import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSignupUserMutation } from "../../features/auth/authApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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

  const onSubmit = async (userData) => {
    try {
      const { confirmPassword, ...rest } = userData;

      await signupUser(rest).unwrap();
      toast.success("New User Created");
      navigate("/");
      reset();
    } catch (err) {
      toast.error("SignUp Failed");
      console.error("Failed to signup:", err);
    }
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative">
      <img
        src="/Frame 1261153634 (1).jpg"
        alt="side_img"
        className="absolute left-0 hidden md:block w-[35%]"
      />
      <div className="w-full max-w-md space-y-8 p-6">
        <div className="flex justify-center">
          <h1 className="text-4xl font-bold text-primary">Logo</h1>
        </div>

        <h2 className="text-center text-2xl font-medium text-gray-900">
          Sign Up
        </h2>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex space-x-2">
            <div className="relative w-[48%]">
              <label htmlFor="first_name" className="sr-only">
                First Name
              </label>
              <div className="flex items-center border rounded-full p-2 shadow-md">
                <span className="pl-3 pr-2">
                  <img
                    src="/fluent_person-32-light.svg"
                    alt="person"
                    className="w-6 h-6"
                  />
                </span>
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
                  className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none text-gray-700"
                  placeholder="First Name"
                />
              </div>
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="relative w-[48%]">
              <label htmlFor="last_name" className="sr-only">
                Last Name
              </label>
              <div className="flex items-center border rounded-full p-2 shadow-md">
                <span className="pl-3 pr-2">
                  <img
                    src="/fluent_person-32-light.svg"
                    alt="person"
                    className="w-6 h-6"
                  />
                </span>
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
                  className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none text-gray-700"
                  placeholder="Last Name"
                />
              </div>
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="relative">
            <label htmlFor="username" className="sr-only">
              User Name
            </label>
            <div className="flex items-center border rounded-full p-2 shadow-md">
              <span className="pl-3 pr-2">
                <img
                  src="/fluent_person-32-light.svg"
                  alt="person"
                  className="w-8 h-8"
                />
              </span>
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
                className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none text-gray-700"
                placeholder="Username"
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <div className="flex items-center border rounded-full p-2 shadow-md">
              <span className="pl-3 pr-2">
                <img src="/Frame 33.svg" alt="email" className="w-8 h-8" />
              </span>
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
                className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none text-gray-700"
                placeholder="Email"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="phone_number" className="sr-only">
              Phone Number
            </label>
            <div className="flex items-center border rounded-full p-2 shadow-md">
              <span className="pl-3 pr-2">
                <img src="/ph_phone-thin.svg" alt="phone" className="w-8 h-8" />
              </span>
              <input
                id="phone_number"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^\d{9}$/, // Example regex for a 10-digit phone number
                    message: "Invalid phone number format",
                  },
                })}
                className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none text-gray-700"
                placeholder="Phone Number"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="flex items-center border rounded-full p-2 shadow-md">
              <span className="pl-3 pr-2">
                <img src="/Frame 34.svg" alt="password" className="w-8 h-8" />
              </span>
              <input
                id="password"
                type={isPasswordVisible ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value:
                      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                    message:
                      "Password must contain at least one uppercase letter, one number, and one special character",
                  },
                })}
                className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none text-gray-700"
                placeholder="Password"
              />
              <button
                type="button"
                className="text-gray-400 pr-3"
                onClick={togglePasswordVisibility}
              >
                <img src="/ion_eye-off.svg" alt="eye_icon" />
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="confirm_password" className="sr-only">
              Confirm Password
            </label>
            <div className="flex items-center border rounded-full p-2 shadow-md">
              <span className="pl-3 pr-2">
                <img src="/Frame 34.svg" alt="password" className="w-8 h-8" />
              </span>
              <input
                id="confirm_password"
                type={isConfirmPasswordVisible ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none text-gray-700"
                placeholder="Confirm Password"
              />
              <button
                type="button"
                className="text-gray-400 pr-3"
                onClick={toggleConfirmPasswordVisibility}
              >
                <img src="/ion_eye-off.svg" alt="eye_icon" />
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full p-3 rounded-full bg-primary text-white ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <Link to="/" className="text-primary">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
