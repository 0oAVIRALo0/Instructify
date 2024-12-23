import React, { useEffect, useState } from "react";
import axios from "../services/api";
import request from "../services/requests";
import banner from "../data/banner.jpg"; 
import { loremIpsum } from "lorem-ipsum"; 
import { Card } from "../components";


function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); 
  const [selectedCourse, setSelectedCourse] = useState(null); 
  const [selectedFile, setSelectedFile] = useState(null); 
  const [dynamicDescription, setDynamicDescription] = useState(""); 

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(request.getCourses, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          withCredentials: true,
        });

        if (response.status === 200) {
          setCourses(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const generateLoremIpsum = (paragraphs = 2) => {
    return loremIpsum({
      count: paragraphs, 
      units: "paragraphs",
      format: "plain",
    });
  };

  const openModal = (course) => {
    setSelectedCourse(course);
    setDynamicDescription(generateLoremIpsum()); 
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const openUploadModal = (course) => {
    setSelectedCourse(course);
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setSelectedCourse(null);
    setSelectedFile(null);
  };

  const handleFileChange = (event) => {
    // console.log("File: ", event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    // console.log("Uploading file to: ", request.uploadVideo);
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("video", selectedFile);
    formData.append("courseId", selectedCourse._id);
    formData.append("title", selectedCourse.title);
    formData.append("description", selectedCourse.description);

    try {
      const response = await axios.post(request.uploadVideo, formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.status === 201) {
        alert("Video uploaded successfully!");
        closeUploadModal();
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video.");
    }
  };

  return (
    <div className="mt-8">
      <div
        className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl p-8 pt-9 m-3 bg-cover bg-no-repeat border border-gray-300"
        style={{
          backgroundImage: `url(${banner})`,
          backgroundSize: "15%",
          backgroundPosition: "right", 
        }}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-gray-500 text-xl">Total Courses Offered</p>
            <p className="text-4xl">{courses.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-3">
        {courses.map((course) => (
          <Card
            key={course._id}
            course={course}
            primaryAction={ 
              { label: "View Details", onClick: () => openModal(course) }
            }
            secondaryAction={ 
              { label: "Upload Video", onClick: () => openUploadModal(course) }
            }
          />
        ))}
      </div>

      {isModalOpen && selectedCourse && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal} 
        >
          <div
            className="bg-white dark:bg-secondary-dark-bg rounded-lg p-6 w-96"
            onClick={(e) => e.stopPropagation()} 
          >
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {selectedCourse.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {selectedCourse.description}
            </p>
            <div className="mt-4">
              <p className="text-gray-600 dark:text-gray-400">
                {dynamicDescription}
              </p>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isUploadModalOpen && selectedCourse && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeUploadModal} 
        >
          <div
            className="bg-white dark:bg-secondary-dark-bg rounded-lg p-6 w-96"
            onClick={(e) => e.stopPropagation()} 
          >
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              Upload Video for {selectedCourse.title}
            </h3>
            <input
              type="file"
              accept="video/*"
              className="mt-4"
              onChange={handleFileChange} 
            />
            <div className="flex justify-end mt-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleFileUpload} 
              >
                Upload
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
                onClick={closeUploadModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyCourses;
