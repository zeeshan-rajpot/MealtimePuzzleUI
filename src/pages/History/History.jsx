import { useState, useCallback } from "react";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import {
  useFetchChildrenQuery,
  useDeleteChildMutation,
} from "../../features/Forms/ChildInfo";
import toast from "react-hot-toast";

const History = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: childrenData,
    error,
    isLoading,
    refetch,
  } = useFetchChildrenQuery();
  const [deleteChild, { isLoading: isDeleting }] = useDeleteChildMutation();

  const filteredChildren = childrenData?.filter((child) => {
    const fullName = `${child.firstName} ${child.lastName}`.toLowerCase();
    const urn = child.urn.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || urn.includes(query);
  });

  const handleDelete = useCallback(
    async (event, urn) => {
      event.preventDefault();
      event.stopPropagation();
      try {
        await deleteChild(urn).unwrap();
        toast.success("Child record deleted successfully");
        refetch();
      } catch (err) {
        toast.error("Failed to delete child record");
        console.log(err);
        
      }
    },
    [deleteChild, refetch]
  );

  return (
    <>
      <Header />
      <section className="flex flex-col lg:flex-row justify-between gap-4 h-auto w-full">
        <SideBar />
        <div className="pt-10 w-full lg:w-[75%] xl:w-[80%] 2xl:w-[85%] h-auto">
          <div className="flex flex-col justify-center items-center">
          <div className="flex justify-between mb-6 w-full px-[7rem] relative">
              <h1 className="text-2xl font-bold text-center ">History </h1>
              <input
                type="text"
                placeholder="Search...."
                className=" border border-gray-300 rounded-lg px-2 py-2 w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <img
                src="/flowbite_search-outline.svg"
                alt="search icon..."
                className="absolute right-[7.5rem] top-1"
              />
            </div>
            {/* Conditional rendering for loading and error */}
            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error loading children data.</p>
            ) : (
              <div className="flex flex-col space-y-4 w-full max-w-4xl">
                {filteredChildren.map((item, index) => (
                  <Link key={index} to={`/history/DetailPage/${item.urn}`}>
                    <div className="border-2 border-gray-100 p-4 flex justify-between rounded-lg shadow-sm hover:border-primary cursor-pointer">
                      <div>
                        <p className="font-semibold">
                          {item.firstName} {item.lastName}
                        </p>
                        <p>{item.urn}</p>
                      </div>
                      <button
                        className="text-red-500 font-bold hover:underline hover:text-white"
                        onClick={(event) => handleDelete(event, item.urn)} // Prevent Link navigation
                        disabled={isDeleting}
                      >
                        Delete
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default History;
