import React from "react";
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
    formState: { errors },
  } = useForm();

  const [signupUser, { isLoading, isError, error }] = useSignupUserMutation();

  const onSubmit = async (userData) => {
    try {
      const response = await signupUser(userData).unwrap();
      // console.log("Signup body", response);
      toast.success("New User Created")
      navigate("/");
      // console.log("Data ", userData);
      
    } catch (err) {
      console.error("Failed to login:", err);
      console.log("Data ", userData);

    }
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

        <h2 className="text-center text-2xl font-medium text-gray-900">Sign Up</h2>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex space-x-2">
            <div className="relative w-[48%]">
              <label htmlFor="first_name" className="sr-only">
                First Name
              </label>
              <div className="flex items-center border rounded-full p-2 shadow-md">
                <span className="pl-3 pr-2">
                  <img src="/fluent_person-32-light.svg" alt="person" className="w-6 h-6" />
                </span>
                <input
                  id="first_name"
                  {...register("firstName", { required: "First Name is required" })}
                  className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none text-gray-700"
                  placeholder="First Name"
                />
              </div>
              {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
            </div>

            <div className="relative w-[48%]">
              <label htmlFor="lastName" className="sr-only">
                Last Name
              </label>
              <div className="flex items-center border rounded-full p-2 shadow-md">
                <span className="pl-3 pr-2">
                  <img src="/fluent_person-32-light.svg" alt="person" className="w-6 h-6" />
                </span>
                <input
                  id="last_name"
                  {...register("lastName", { required: "Last Name is required" })}
                  className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none text-gray-700"
                  placeholder="Last Name"
                />
              </div>
              {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
            </div>
          </div>

          <div className="relative">
            <label htmlFor="username" className="sr-only">
              User Name
            </label>
            <div className="flex items-center border rounded-full p-2 shadow-md">
              <span className="pl-3 pr-2">
                <img src="/fluent_person-32-light.svg" alt="person" className="w-8 h-8" />
              </span>
              <input
                id="username"
                {...register("username", { required: "Username is required" })}
                className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none text-gray-700"
                placeholder="Username"
              />
            </div>
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
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
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
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
                {...register("phone", { required: "Phone number is required" })}
                className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none text-gray-700"
                placeholder="Phone Number"
              />
            </div>
            {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number.message}</p>}
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
                type="password"
                {...register("password", { required: "Password is required" })}
                className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none text-gray-700"
                placeholder="Password"
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {/* <div className="relative">
            <label htmlFor="confirm_password" className="sr-only">
              Confirm Password
            </label>
            <div className="flex items-center border rounded-full p-2 shadow-md">
              <span className="pl-3 pr-2">
                <img src="/Frame 34.svg" alt="password" className="w-8 h-8" />
              </span>
              <input
                id="confirm_password"
                type="password"
                {...register("confirm_password", { required: "Confirm Password is required" })}
                className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none text-gray-700"
                placeholder="Confirm Password"
              />
            </div>
            {errors.confirm_password && <p className="text-red-500 text-sm">{errors.confirm_password.message}</p>}
          </div> */}

          {/* Dropdown for Role */}
          <div className="relative">
            <label htmlFor="role" className="sr-only">
              Role
            </label>
            <div className="flex items-center border rounded-full p-2 shadow-md">
              <span className="pl-3 pr-2">
                <img src="/fluent_person-32-light.svg" alt="role" className="w-6 h-6" />
              </span>
              <select
                id="role"
                {...register("role", { required: "Role is required" })}
                className="flex-1 px-2 py-2 rounded-full bg-transparent outline-none text-gray-700 appearance-none"
              >
                <option value="">Select a role</option>
                <option value="Psychologist">Psychologist</option>
                <option value="Speech Pathologist">Speech Pathologist</option>
                <option value="Occupational Therapist">Occupational therapist</option>
                <option value="Paediatric Dietitian">Paediatric Dietitian</option>
                <option value="Paediatrician">Paediatrician</option>
              </select>
            </div>
            {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
          </div>

          <div>
            <button type="submit" className="w-full py-3 px-4 bg-custom-gradient text-white rounded-full shadow-lg">
               {isLoading ? "  Signing Up..." : "  Sign Up"}
            </button>
          </div>

          {isError && (
            <p className="text-red-500">
              {error?.data?.message || "Error during login"}
            </p>
          )}

          <div className="text-center text-sm text-gray-600">
            I have an account?{" "}
            <Link to="/" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
