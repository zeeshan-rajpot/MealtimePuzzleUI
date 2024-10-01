import { React, useState } from "react";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import { useFetchChildrenQuery } from "../../features/Forms/ChildInfo";

const History = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: childrenData, error, isLoading } = useFetchChildrenQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading children data.</p>;

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
            <h1 className="text-2xl font-bold text-center mb-6">History</h1>
            <div className="flex flex-col space-y-4 w-full max-w-4xl">
              {filteredChildren.map((item, index) => (
                <Link to={`/history/DetailPage/${item.urn}`}>
                  <div
                    key={index}
                    className="border-2 border-gray-100 p-4 flex justify-between rounded-lg shadow-sm hover:border-primary cursor-pointer"
                  >
                    <div>
                      <p className="font-semibold">
                        {item.firstName} {item.lastName}
                      </p>
                      <p>{item.urn}</p>
                    </div>
                    <button className="text-red-500 font-bold hover:underline">
                      Delete
                    </button>
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

export default History;
