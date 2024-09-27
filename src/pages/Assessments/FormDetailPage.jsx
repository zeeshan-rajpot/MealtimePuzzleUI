import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";

const FormDetailPage = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  const stepData = [
    {
      category: "Self Feeding",
      clinicalPrompt:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      impression:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      recommendation:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      category: "Caregivers Influence",
      clinicalPrompt:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      impression:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      recommendation:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  ];

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

          <div className="w-full max-w-3xl mx-auto pb-12">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-semibold ">Child Information</h2>
              <h2 className="text-2xl font-semibold ">2nd Session</h2>
            </div>

            <div className="mt-4 space-y-6">
              <p className="text-sm font-medium">
                Child's URN(Unit Record Number)
              </p>
              <p className="border-b-2">090078601</p>
              <div className="flex spce-betwee items-center space-x-3">
                <div className="flex-col w-[50%]">
                  <p className="text-sm font-medium ">Child First Name:</p>
                  <p className="border-b-2 py-1">Mohsin</p>
                </div>
                <div className="flex-col  w-[50%]">
                  <p className="text-sm font-medium">Child Last Name:</p>
                  <p className="border-b-2 py-1">Zulfqar</p>
                </div>
              </div>

              <p className="text-sm font-medium">Parent/Caretaker Name:</p>
              <p className="border-b-2 ">Zulfiqar Ali</p>
              <p className="text-sm font-medium">Date of Birth:</p>
              <p className="border-b-2 ">30/12/2022</p>

              <p className="text-sm font-medium">Email:</p>
              <p className="border-b-2 ">Example@gmail.com</p>
              <p className="text-sm font-medium">Contact Number:</p>
              <p className="border-b-2 ">090078601</p>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-semibold ">Mealtime</h2>

              {stepData.map((step, index) => (
                <div key={index} className="space-y-6">
                  <h3 className="mt-8 text-lg font-semibold">
                    {step.category}
                  </h3>
                  {/* <p>Role: {step.role || "not found"}</p> */}
                  <p className="text-sm font-medium">Clinical Prompt: </p>
                  <p className="border-b-2 ">
                    {step.clinicalPrompt || "not found"}
                  </p>
                  <p className="text-sm font-medium">Impression: </p>
                  <p className="border-b-2 ">
                    {step.impression || "not found"}
                  </p>
                  <p className="text-sm font-medium">Recommendation: </p>
                  <p className="border-b-2 ">
                    {step.recommendation || "not found"}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center space-x-4">
              <button
                className="bg-custom-gradient text-white px-32 py-2 rounded-full"
                // onClick={handleSave}
              >
                Save
              </button>
              <button
                // onClick={handlePrint}
                className="border-2 border-primary text-primary px-28 py-2 rounded-full flex"
              >
                <img src="/lets-icons_print-duotone.svg" alt="print" />
                Print
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FormDetailPage;
