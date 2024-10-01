import React, { useEffect, useState } from "react";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const Buttunpage = () => {
    const { urn } = useParams(); // Get the child URN from the route params
    const [totalSessions, setTotalSessions] = useState(0); // State to store the total number of sessions

    // Fetch the total number of sessions from the API
    useEffect(() => {
        const fetchSessions = async () => {
            const token = localStorage.getItem("token"); // Get token from localStorage
            try {
                const response = await axios.get(`http://localhost:5001/api/get/childSessions/${urn}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add token in Authorization header
                    },
                });
                setTotalSessions(response.data.totalSessions); // Set the number of sessions from the API response
            } catch (error) {
                toast.error("Failed to fetch session data");
                console.error("Error fetching session data:", error);
            }
        };

        if (urn) {
            fetchSessions(); // Call the API when urn is available
        }
    }, [urn]);

    return (
        <>
            <Header />
            <section className="flex flex-col lg:flex-row justify-between gap-4 h-auto w-full">
                <SideBar />
                <div className="pt-10 w-full lg:w-[75%] xl:w-[80%] 2xl:w-[85%] h-auto">
                    <div className="flex flex-col justify-center items-center">
                        <div className="w-full max-w-3xl mx-auto flex justify-center items-center flex-col">
                            <h2 className="text-xl font-bold mb-4">Total Sessions: {totalSessions}</h2>
                            <div className="flex flex-wrap gap-2">
                                {/* Render a button for each session */}
                                {Array.from({ length: totalSessions }, (_, index) => (

<>
<Link to={`/interventionupdate/pyramid/${urn}/${index + 1}`}>
                                    <button key={index} className=' className="w-full py-3 px-10 bg-custom-gradient text-white rounded-full  shadow-lg my-8'>
                                        {" "}
                                        Update  Session {index + 1}
                                    </button>
</Link>
</>

                                ))}
                            </div>

                            
                            <Link to={`/intervention/pyramid/${urn}`}>
                            <button className=' className="w-full py-3 px-10 bg-custom-gradient text-white rounded-full  shadow-lg my-8'>
                                {" "}
                                Add New Intervention{" "}
                            </button>
                            </Link>
                          
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Buttunpage;
