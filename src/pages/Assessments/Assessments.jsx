import React from "react";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";

const Assessments = () => {
  const Data = [
    { assessments: "Assessment 1", name: "Mohsin Ali Raza", id: "090078601" },
    { assessments: "Assessment 2", name: "Mohsin Ali Raza", id: "090078601" },
    { assessments: "Assessment 3", name: "Mohsin Ali Raza", id: "090078601" },
    { assessments: "Assessment 4", name: "Mohsin Ali Raza", id: "090078601" },
    { assessments: "Assessment 5", name: "Mohsin Ali Raza", id: "090078601" },
  ];
  return (
    <>
      <Header />
      <section className="flex flex-col lg:flex-row justify-between gap-4 h-auto w-full">
        <SideBar />
        <div className="pt-10 w-full lg:w-[75%] xl:w-[80%] 2xl:w-[85%] h-auto">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-2xl font-bold text-center mb-6">
              Assessments{" "}
            </h1>
            <div className="space-y-4 w-full max-w-4xl">
              {Data.map((item, index) => (
                <div
                  key={index}
                  className="border-2 border-gray-100 p-4 flex justify-between rounded-lg shadow-sm hover:border-primary"
                >
                  <div>
                    <p className="font-semibold text-lg">{item.assessments}</p>
                    <p className="font-base">{item.name}</p>
                    <p>{item.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Assessments;
