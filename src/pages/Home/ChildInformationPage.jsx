import React, { useState } from "react";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useChildUserMutation } from "../../features/Forms/ChildInfo";

const ChildInformationPage = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [childUser, { isLoading, isError, error }] = useChildUserMutation();

  // Watch input values for validation
  const urnValue = watch("urn");
  const phoneValue = watch("contactPhone");
  const finNumberValue = watch("finnumber");

  const onSubmit = async (data) => {

    const token = localStorage.getItem("token");

    try {
      const response = await fetch('http://localhost:5001/api/child', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();

      console.log(responseData.message);

      toast(responseData.message);
      const childName = data.firstName + " " + data.lastName;
      navigate(`/home/options/${data.urn}/${childName}`);


    } catch (error) {
      console.log(error.message);
      toast.error(error.message);

    }
  };

  return (
    <>
      <Header />
      <section className="flex flex-col lg:flex-row justify-between gap-4 h-auto w-full">
        <SideBar />
        <div className="pt-10 w-full lg:w-[75%] xl:w-[80%] 2xl:w-[85%] h-auto">
          <div className="flex mt-4" onClick={handleBack}>
            <img src="/ion_chevron-back.svg" alt="back_arrow" />
            <button className="text-base">Back</button>
          </div>
          <div className="w-full max-w-3xl mx-auto flex justify-center items-center flex-col">
            <h2 className="text-2xl font-semibold">Child Information</h2>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full mt-4 space-y-4"
            >
              {/* Child's URN */}
              <div className="input-container">
                <input
                  id="urn"
                  type="number"
                  {...register("urn", {
                    required: "URN is required",
                    minLength: {
                      value: /^[0-9]{9}$/,
                      message: "URN must be 9 digits",
                    },
                  })}
                  placeholder=" "
                  className={`peer focus:outline-none ${errors.urn
                    ? "border-red-500 focus:ring-red-500"
                    : urnValue?.length === 9
                      ? "border-green-500 focus:ring-green-500"
                      : "border-gray-300 focus:ring-ceruleanBlue"
                    }`}
                />
                <label htmlFor="urn">Child's URN (Unit Record Number)</label>
                {errors.urn && (
                  <p className="text-red-500">{errors.urn.message}</p>
                )}
              </div>

              {/* First Name & Last Name */}
              <div className="flex space-x-3">
                <div className="input-container w-full">
                  <input
                    id="firstName"
                    type="text"
                    {...register("firstName", {
                      required: "First name is required",
                      minLength: {
                        value: 2,
                        message: "First name must be at least 2 characters",
                      },
                    })}
                    placeholder=" "
                    className={`peer focus:outline-none ${errors.firstName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-ceruleanBlue"
                      }`}
                  />
                  <label htmlFor="firstName">Child First Name</label>
                  {errors.firstName && (
                    <p className="text-red-500">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="input-container w-full">
                  <input
                    id="lastName"
                    type="text"
                    {...register("lastName", {
                      required: "Last name is required",
                      minLength: {
                        value: 2,
                        message: "Last name must be at least 2 characters",
                      },
                    })}
                    placeholder=" "
                    className={`peer focus:outline-none ${errors.lastName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-ceruleanBlue"
                      }`}
                  />
                  <label htmlFor="lastName">Child Last Name</label>
                  {errors.lastName && (
                    <p className="text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Date of Birth & Parent Name */}
              <div className="flex space-x-3">
                <div className="input-container w-full">
                  <input
                    id="dateOfBirth"
                    type="date"
                    {...register("dateOfBirth", {
                      required: "Date of birth is required",
                      validate: (value) => {
                        const today = new Date();
                        const dob = new Date(value);
                        return dob < today || "Date of birth cannot be in the future";
                      },
                    })}
                    placeholder=" "
                    className={`peer focus:outline-none ${errors.dateOfBirth
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-ceruleanBlue"
                      }`}
                  />
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  {errors.dateOfBirth && (
                    <p className="text-red-500">{errors.dateOfBirth.message}</p>
                  )}
                </div>

                <div className="input-container w-full">
                  <input
                    id="parentName"
                    type="text"
                    {...register("parentName", {
                      required: "Parent name is required",
                      minLength: {
                        value: 2,
                        message: "Parent name must be at least 2 characters",
                      },
                    })}
                    placeholder=" "
                    className={`peer focus:outline-none ${errors.parentName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-ceruleanBlue"
                      }`}
                  />
                  <label htmlFor="parentName">Parent/Caretaker Name</label>
                  {errors.parentName && (
                    <p className="text-red-500">{errors.parentName.message}</p>
                  )}
                </div>
              </div>

              {/* Gender Selection */}
              <div className="flex items-center space-x-4">
                <label className="text-gray-500">Sex:</label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register("gender", { required: "Gender is required" })}
                      value="male"
                      className="form-radio text-ceruleanBlue"
                    />
                    <span className="ml-2">Male</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register("gender", { required: "Gender is required" })}
                      value="female"
                      className="form-radio text-ceruleanBlue"
                    />
                    <span className="ml-2">Female</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register("gender", { required: "Gender is required" })}
                      value="intersex"
                      className="form-radio text-ceruleanBlue"
                    />
                    <span className="ml-2">Other</span>
                  </label>
                </div>
                {errors.gender && (
                  <p className="text-red-500">{errors.gender.message}</p>
                )}
              </div>

              {/* Contact Email & Phone */}
              <div className="flex space-x-3">
                <div className="input-container w-full">
                  <input
                    id="contactEmail"
                    type="email"
                    {...register("contactEmail", {
                      required: "Email is required",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email address",
                      },
                    })}
                    placeholder=" "
                    className={`peer focus:outline-none ${errors.contactEmail
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-ceruleanBlue"
                      }`}
                  />
                  <label htmlFor="contactEmail">Parent/Caretaker Email Address</label>
                  {errors.contactEmail && (
                    <p className="text-red-500">{errors.contactEmail.message}</p>
                  )}
                </div>
                <div className="input-container w-full">
                  <input
                    id="contactPhone"
                    type="tel"
                    {...register("contactPhone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{9}$/,
                        message: "Phone number must be 9 digits",
                      },
                    })}
                    placeholder=" "
                    className={`peer focus:outline-none ${errors.contactPhone
                      ? "border-red-500 focus:ring-red-500"
                      : phoneValue?.length === 9
                        ? "border-green-500 focus:ring-green-500"
                        : "border-gray-300 focus:ring-ceruleanBlue"
                      }`}
                  />
                  <label htmlFor="contactPhone">Parent/Caretaker Contact Number</label>
                  {errors.contactPhone && (
                    <p className="text-red-500">{errors.contactPhone.message}</p>
                  )}
                </div>
              </div>

              {/* FIN Number */}
              <div className="input-container">
                <input
                  id="finnumber"
                  type="number"
                  {...register("finnumber", {
                    required: "FIN number is required",
                    pattern: {
                      value: /^[0-9]{7}$/,
                      message: "FIN number must be 7 digits",
                    },
                  })}
                  placeholder=" "
                  className={`peer focus:outline-none ${errors.finnumber
                    ? "border-red-500 focus:ring-red-500"
                    : finNumberValue?.length === 7
                      ? "border-green-500 focus:ring-green-500"
                      : "border-gray-300 focus:ring-ceruleanBlue"
                    }`}
                />
                <label htmlFor="finnumber">Child FIN Number</label>
                {errors.finnumber && (
                  <p className="text-red-500">{errors.finnumber.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center my-4">
                <button
                  type="submit"
                  className="bg-ceruleanBlue text-white rounded-full py-3 px-32 hover:bg-blushPink transition"
                >
                  {isLoading ? "Submitting..." : "Next"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChildInformationPage;
