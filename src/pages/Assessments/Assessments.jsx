import React, { useState } from "react";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import { useFetchChildrenQuery } from "../../features/Forms/ChildInfo";

const Assessments = () => {
  // State for search query input
  const [searchQuery, setSearchQuery] = useState("");
  // Fetch children data using RTK Query
  const { data: childrenData, error, isLoading } = useFetchChildrenQuery();

  // Display loading message if data is still being fetched
  if (isLoading) return <p>Loading...</p>;
  // Display error message if there's an issue fetching data
  if (error) return <p>Error loading children data.</p>;

  // Filter children data based on the search query (matching name or URN)
  const filteredChildren = childrenData?.filter((child) => {
    const fullName = `${child.firstName} ${child.lastName}`.toLowerCase();
    const urn = child.urn.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || urn.includes(query);
  });

  return (
    <>
      <Header />
      <section className="flex flex-col lg:flex-row justify-between gap-4 h-auto w-full">
        <SideBar />
        <div className="pt-10 w-full lg:w-[75%] xl:w-[80%] 2xl:w-[85%] h-auto">
          <div className="flex flex-col justify-center items-center">
            {/* Search Input */}
            <div className="flex justify-between mb-6 w-full px-[7rem] relative">
              <h1 className="text-2xl font-bold text-center">Assessment</h1>
              <input
                type="text"
                placeholder="Search...."
                className="border border-gray-300 rounded-lg px-2 py-2 w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <img
                src="/flowbite_search-outline.svg"
                alt="search icon..."
                className="absolute right-[7.5rem] top-1"
              />
            </div>

            {/* Display filtered children */}
            <div className="space-y-4 w-full max-w-4xl">
              {filteredChildren?.length > 0 ? (
                filteredChildren.map((child) => (
                  <Link
                    key={child.finnumber} // Added key for each child entry
                    to={`/Buttunpage/${child.urn}/${child.firstName} ${child.lastName}`}
                    className="border-2 border-gray-100 p-4 flex justify-between rounded-lg shadow-sm hover:border-primary"
                  >
                    <div>
                      <p className="font-semibold">
                        {child.firstName} {child.lastName}
                      </p>
                      <p>{child.urn}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p>No children found</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Assessments;
