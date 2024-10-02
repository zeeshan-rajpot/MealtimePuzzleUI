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
  } = useForm();

  const [childUser, { isLoading, isError, error }] = useChildUserMutation();

  const onSubmit = async (data) => {
    try {
      await childUser(data).unwrap();
      toast.success("Child Detail Added");
      navigate(`/home/formulationOptions/${data.urn}`);

      localStorage.setItem("childData", JSON.stringify(data));
    } catch (err) {
      toast.error("Error submitting child information");
      console.error(err);
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
              <div>
                <input
                  type="text"
                  {...register("urn", {
                    required: "URN is required",
                    minLength: {
                      value: 6,
                      message: "URN must be at least 6 characters",
                    },
                  })}
                  placeholder="Child's URN (Unit Record Number)"
                  className="w-full p-3 border rounded"
                />
                {errors.urn && (
                  <p className="text-red-500 ">{errors.urn.message}</p>
                )}
              </div>

              {/* First Name & Last Name */}
              <div className="flex space-x-3">
                <div className="w-full">
                  <input
                    type="text"
                    {...register("firstName", {
                      required: "First name is required",
                      minLength: {
                        value: 2,
                        message: "First name must be at least 2 characters",
                      },
                    })}
                    placeholder="Child First Name"
                    className="w-full p-3 border rounded"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 ">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="w-full">
                  <input
                    type="text"
                    {...register("lastName", {
                      required: "Last name is required",
                      minLength: {
                        value: 2,
                        message: "Last name must be at least 2 characters",
                      },
                    })}
                    placeholder="Child Last Name"
                    className="w-full p-3 border rounded"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 ">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Date of Birth & Parent Name */}
              <div className="flex space-x-3">
                <div className="w-full">
                  <input
                    type="date"
                    {...register("dateOfBirth", {
                      required: "Date of birth is required",
                      validate: (value) => {
                        const today = new Date();
                        const dob = new Date(value);
                        return (
                          dob < today || "Date of birth cannot be in the future"
                        );
                      },
                    })}
                    placeholder="Date of Birth"
                    className="w-full p-3 border rounded"
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 ">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <input
                    type="text"
                    {...register("parentName", {
                      required: "Parent name is required",
                      minLength: {
                        value: 2,
                        message: "Parent name must be at least 2 characters",
                      },
                    })}
                    placeholder="Parent/Caretaker Name"
                    className="w-full p-3 border rounded"
                  />
                  {errors.parentName && (
                    <p className="text-red-500 ">{errors.parentName.message}</p>
                  )}
                </div>
              </div>

              {/* Contact Email & Contact Phone */}
              <div className="flex space-x-3">
                <div className="w-full">
                  <input
                    type="email"
                    {...register("contactEmail", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email address",
                      },
                    })}
                    placeholder="Parent/Caretaker Email Address"
                    className="w-full p-3 border rounded"
                  />
                  {errors.contactEmail && (
                    <p className="text-red-500 ">
                      {errors.contactEmail.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <input
                    type="tel"
                    {...register("contactPhone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{9}$/,
                        message: "Phone number must be 9 digits",
                      },
                    })}
                    placeholder="Parent/Caretaker Contact Number"
                    className="w-full p-3 border rounded"
                  />
                  {errors.contactPhone && (
                    <p className="text-red-500 ">
                      {errors.contactPhone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Gender & FIN Number */}
              <div className="flex space-x-3">
                <div className="w-full">
                  <select
                    {...register("gender", { required: "Gender is required" })}
                    className="w-full p-3 border rounded"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="intersex">Intersex</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 ">{errors.gender.message}</p>
                  )}
                </div>

                <div className="w-full">
                  <input
                    type="text"
                    {...register("finnumber", {
                      required: "FIN number is required",
                      pattern: {
                        value: /^[A-Za-z0-9]{6}$/,
                        message: "FIN number must be 6 characters",
                      },
                    })}
                    placeholder="Child FIN Number"
                    className="w-full p-3 border rounded"
                  />
                  {errors.finnumber && (
                    <p className="text-red-500 ">{errors.finnumber.message}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center my-4">
                <button
                  type="submit"
                  className="bg-primary text-white rounded-full py-3 px-32"
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
