import React from "react";
import { useForm } from "react-hook-form";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { useChildUserMutation } from "../../features/Forms/ChildInfo";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ChildInformationPage = () => {
  const navigate = useNavigate();
  const {
    register, // used to register form inputs
    handleSubmit, // used to handle form submission
    reset,
    formState: { errors }, // used to handle validation errors
  } = useForm();

  const [childUser, { isLoading, isError, isSuccess }] = useChildUserMutation();

  const onSubmit = async (formData) => {
    try {
      // Save form data to localStorage
      localStorage.setItem("childInformation", JSON.stringify(formData));

      // Make API call
      await childUser(formData).unwrap();
      // Handle success logic here (e.g., navigate to next page or show success message)
      toast.success("Child Added Successfully");
      reset();
      navigate("/home/formulationOptions");
    } catch (error) {
      // Handle error logic here (e.g., display error message)
      console.error("Error submitting form:", error);
      toast.error("An Error Occured");
    }
  };

  return (
    <>
      <Header />
      <section className="flex flex-col lg:flex-row justify-between gap-4 h-auto w-full">
        <SideBar />
        <div className="pt-10 w-full lg:w-[75%] xl:w-[80%] 2xl:w-[85%] h-auto">
          <div className="flex mt-4">
            <img src="/ion_chevron-back.svg" alt="back_arrow" />
            <button className="text-base">Back</button>
          </div>
          <div className="w-full max-w-3xl mx-auto flex justify-center items-center flex-col">
            <h2 className="text-2xl font-semibold">Child Information</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-4">
              <input
                type="text"
                {...register("urn", { required: "URN is required" })}
                placeholder="child's URN (Unit Record Number)?"
                className="w-full p-3 border rounded mb-4"
              />
              {errors.urn && (
                <p className="text-red-500">{errors.urn.message}</p>
              )}

              <div className="flex space-x-3">
                <input
                  type="text"
                  {...register("firstName", {
                    required: "First Name is required",
                  })}
                  placeholder="Child First Name"
                  className="w-full p-3 border rounded mb-4"
                />
                <div>
                  
                </div>
               

                <input
                  type="text"
                  {...register("lastName", {
                    required: "Last Name is required",
                  })}
                  placeholder="Child Last Name"
                  className="w-full p-3 border rounded mb-4"
                />
              
              </div>

              <div className="flex space-x-3">
                <input
                  type="text"
                  {...register("parentName", {
                    required: "Parent/Caretaker Name is required",
                  })}
                  placeholder="Parent/Caretaker Name"
                  className="w-full p-3 border rounded mb-4"
                />
              

                <input
                  type="date"
                  {...register("dob", {
                    required: "Date of Birth is required",
                  })}
                  className="w-full p-3 border rounded mb-4"
                />
               
              </div>

              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/,
                    message: "Invalid email address",
                  },
                })}
                placeholder="Parent/Caretaker Email Address"
                className="w-full p-3 border rounded mb-4"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}

              <input
                type="text"
                {...register("contact", {
                  required: "Contact Number is required",
                })}
                placeholder="Parent/Caretaker Contact Number"
                className="w-full p-3 border rounded mb-4"
              />
              {errors.contact && (
                <p className="text-red-500">{errors.contact.message}</p>
              )}

              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="bg-primary text-white rounded-full py-3 px-32"
                  disabled={isLoading}
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
