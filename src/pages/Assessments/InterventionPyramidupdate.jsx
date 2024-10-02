import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../features/config";

const InterventionPyramidupdate = () => {
  const { urn, session } = useParams();
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageLabel, setCurrentImageLabel] = useState("");
  const [imageDataCounter, setImageDataCounter] = useState(0);
  const [modalData, setModalData] = useState({
    clinicalPrompt: "",
    priority: "",
    recommendation: "",
  });
  const [interventionData, setInterventionData] = useState(null);

  useEffect(() => {
    const fetchInterventionData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${baseUrl}/get/intervention/${urn}/${session}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setInterventionData(response.data);
      } catch (err) {
        console.error("Error fetching intervention data:", err);
        toast.error("Failed to load intervention data");
      }
    };

    fetchInterventionData();
  }, [urn, session]);

  const handleImageClick = (label) => {
    setCurrentImageLabel(label);

    const entry = interventionData?.sessionEntries?.find(
      (entry) => entry.domainname === label
    );

    if (entry) {
      setModalData({
        clinicalPrompt: entry.clinicalPrompt,
        priority: entry.priority,
        recommendation: entry.recommendation,
      });
    } else {
      setModalData({
        clinicalPrompt: "",
        priority: "",
        recommendation: "",
      });
    }

    setIsModalOpen(true);
  };

  const handleModalSave = () => {
    const updatedEntries = interventionData.sessionEntries.map((entry) =>
      entry.domainname === currentImageLabel
        ? { ...entry, ...modalData }
        : entry
    );

    const isNewData = !interventionData.sessionEntries.find(
      (entry) => entry.domainname === currentImageLabel
    );

    if (isNewData) {
      updatedEntries.push({ domainname: currentImageLabel, ...modalData });
      setImageDataCounter((prevCount) => prevCount + 1);
    }

    setInterventionData((prev) => ({
      ...prev,
      sessionEntries: updatedEntries,
    }));

    setSelectedImages((prev) =>
      prev.includes(currentImageLabel) ? prev : [...prev, currentImageLabel]
    );

    setIsModalOpen(false);
  };

  const handleNextClick = async () => {
    if (selectedImages.length === 0) {
      alert("Select at least one category");
    } else {
      try {
        const token = localStorage.getItem("token");
        const domains = selectedImages.map((label) => {
          const entry = interventionData.sessionEntries.find(
            (entry) => entry.domainname === label
          );
          return {
            domainName: entry?.domainname || label,
            clinicalPrompt: entry?.clinicalPrompt || "",
            priority: entry?.priority || "",
            recommendation: entry?.recommendation || "",
          };
        });

        await axios.put(
          `${baseUrl}/update/intervention/${urn}/${session}`,
          {
            domains,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Intervention updated successfully!");
        navigate(`/home/detailpage/${urn}/${session}`);
      } catch (err) {
        console.error("Failed to update intervention:", err);
        toast.error("Failed to update intervention");
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Header />
      <section className="w-full flex gap-4">
        <SideBar />
        <div className="w-full">
          <div className="flex justify-between items-center">
            <div className="flex mt-4" onClick={handleBack}>
              <img src="/ion_chevron-back.svg" alt="back_arrow" />
              <button className="text-base">Back</button>
            </div>
            <div className="text-base font-semibold mr-12">
              <br />
              {`Domains added: ${imageDataCounter}/ 17`}
            </div>
          </div>

          <div className="flex justify-center items-center flex-col my-10 ">
            <h1 className="text-2xl font-semibold">Select The Domain</h1>
            <div
              data-label="Variety & Volume"
              onClick={() => handleImageClick(1, "Variety & Volume")}
              className="mt-8"
            >
              <img src="/Frame 1261153616.svg" alt="food" />
            </div>

            <div
              data-label="New Food Learning"
              onClick={() => handleImageClick(2, "New Food Learning")}
            >
              <img src="/Frame 1261153617.svg" alt="food" />
            </div>

            <div
              data-label="Food Mapping"
              onClick={() => handleImageClick(3, "Food Mapping")}
            >
              <img src="/Frame 1261153618.svg" alt="food" />
            </div>

            <div className="flex">
              <div
                data-label="Sensory"
                onClick={() => handleImageClick(4, "Sensory")}
              >
                <img src="/Frame 1261153619.svg" alt="food" />
              </div>

              <div
                data-label="Oral Motor"
                onClick={() => handleImageClick(5, "Oral Motor")}
              >
                <img src="/Frame 1261153620.svg" alt="food" />
              </div>
            </div>
            <div className="flex">
              <div
                data-label="Self Feeding"
                onClick={() => handleImageClick(6, "Self Feeding")}
              >
                <img src="/Frame 1261153621.svg" alt="food" />
              </div>
              <div
                data-label="Mealtime Engagement"
                onClick={() => handleImageClick(7, "Mealtime Engagement")}
              >
                <img src="/Frame 1261153622.svg" alt="food" />
              </div>
            </div>
            <div className="flex mt-4">
              <div
                data-label="Food Exposure"
                onClick={() => handleImageClick(8, "Food Exposure")}
              >
                <img src="/Frame 1261153624.svg" alt="food" />
              </div>
              <div
                data-label="Mealtime Environment"
                onClick={() => handleImageClick(9, "Mealtime Environment")}
              >
                <img src="/Frame 1261153625.svg" alt="food" />
              </div>
              <div
                data-label="Flexibility"
                onClick={() => handleImageClick(10, "Flexibility")}
              >
                <img src="/Frame 1261153626.svg" alt="food" />
              </div>
            </div>
            <div className="flex">
              <div
                data-label="Hunger Cycle"
                onClick={() => handleImageClick(11, "Hunger Cycle")}
              >
                <img src="/Frame 1261153627.svg" alt="food" />
              </div>
              <div
                data-label="Mealtime Roles"
                onClick={() => handleImageClick(12, "Mealtime Roles")}
              >
                <img src="/Frame 1261153628.svg" alt="food" />
              </div>
              <div
                data-label="Caregivers Influence"
                onClick={() => handleImageClick(13, "Caregivers Influence")}
              >
                <img src="/Frame 1261153629.svg" alt="food" />
              </div>
              <div
                data-label="Calm Mealtimes"
                onClick={() => handleImageClick(14, "Calm Mealtimes")}
              >
                <img src="/Frame 1261153630.svg" alt="food" />
              </div>
            </div>
            <div className="flex">
              <div
                data-label="Development"
                onClick={() => handleImageClick(15, "Development")}
              >
                <img src="/Frame 1261153631.svg" alt="food" />
              </div>
              <div
                data-label="Medical / Nutrition"
                onClick={() => handleImageClick(16, "Medical or Nutrition")}
              >
                <img src="/Frame 1261153632.svg" alt="food" />
              </div>
              <div
                data-label="Temperament"
                onClick={() => handleImageClick(17, "Temperament")}
              >
                <img src="/Frame 1261153633.svg" alt="food" />
              </div>
            </div>

            <button
              className="mt-8 w-[30%] rounded-full px-4 py-2 bg-custom-gradient text-white"
              onClick={handleNextClick}
            >
              Update
            </button>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-1/2">
            <div className="text-center mb-3 text-lg font-semibold ">
              Edit Domain
            </div>

            <div className="flex flex-col my-2">
              <label>Clinical Prompt</label>
              <input
                value={modalData.clinicalPrompt}
                onChange={(e) =>
                  setModalData((prev) => ({
                    ...prev,
                    clinicalPrompt: e.target.value,
                  }))
                }
                placeholder="Enter clinical prompt"
                className="input-field border-2 py-1"
              />
            </div>

            <div className="flex flex-col my-2">
              <label>Priority</label>
              <select
                value={modalData.priority}
                onChange={(e) =>
                  setModalData((prev) => ({
                    ...prev,
                    priority: e.target.value,
                  }))
                }
                className="select-field border-2 py-1"
              >
                <option value="">Select Priority</option>
                <option value="high">High</option>
                <option value="moderate">Moderate</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="flex flex-col my-2">
              <label>Recommendation</label>
              <input
                value={modalData.recommendation}
                onChange={(e) =>
                  setModalData((prev) => ({
                    ...prev,
                    recommendation: e.target.value,
                  }))
                }
                placeholder="Enter recommendation"
                className="input-field border-2 py-1"
              />
            </div>

            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 text-white px-8 py-2 rounded-full mr-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleModalSave}
                className="bg-custom-gradient text-white px-8 py-2 rounded-full"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InterventionPyramidupdate;
