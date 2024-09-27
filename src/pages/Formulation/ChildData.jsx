import React, { Children } from "react";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import { useFetchChildrenQuery } from "../../features/Forms/ChildInfo";

const ChildData = () => {
  const { data: childrenData, error, isLoading } = useFetchChildrenQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading children data.</p>;


  return (
    <>
      <Header />
      <section className="flex flex-col lg:flex-row justify-between gap-4 h-auto w-full">
        <SideBar />
        <div className="pt-10 w-full lg:w-[75%] xl:w-[80%] 2xl:w-[85%] h-auto">
          <div className="flex flex-col justify-center items-center">
            <div className="flex justify-between mb-6 w-full px-[7rem] relative">
              <h1 className="text-2xl font-bold text-center ">Formulation </h1>
              <input
                type="text"
                placeholder="Search..."
                className=" border border-gray-300 rounded-lg px-2 py-2 w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <img
                src="/flowbite_search-outline.svg"
                alt="search icon..."
                className="absolute right-[7.5rem] top-1"
              />
            </div>

            <div className="space-y-4 w-full max-w-4xl">
              {childrenData?.map((child) => (
                <Link
                  to={`/childData/formulation`}
                  className="border-2 border-gray-100 p-4 flex justify-between rounded-lg shadow-sm hover:border-primary"
                >
                  <div>
                    <div key={child.finnumber}>
                      <p className="font-semibold">
                        {child.firstName} {child.lastName}
                      </p>
                      <p>{child.urn}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChildData;
