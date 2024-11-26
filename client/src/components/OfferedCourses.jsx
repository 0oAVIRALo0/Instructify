import React, { useEffect, useState } from "react";
import axios from "../services/api";
import request from "../services/requests";
import { LoremIpsum } from "lorem-ipsum"; 
import banner from '../data/banner.jpg'; 

function OfferedCourses() {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null); // Stores the selected course details
  const [loremText, setLoremText] = useState(""); // State for lorem ipsum text

  // Initialize Lorem Ipsum generator
  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 6,
      min: 3,
    },
    wordsPerSentence: {
      max: 16,
      min: 4,
    },
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(request.getAllCourses, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
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

  const enrollInCourse = async (courseId) => {
    try {
      const response = await axios.post(`${request.enrollInCourse}/${courseId}`,
        {},
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Enroll in course response:", response);

      if (response.status === 200) {
        alert("Successfully enrolled in the course!");
      } 
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      }
    }
  };

  const openModal = (course) => {
    setSelectedCourse(course);
    setLoremText(lorem.generateParagraphs(1)); // Generate a random lorem ipsum paragraph
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setIsModalOpen(false);
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
          <div
            key={course._id}
            className="bg-white dark:bg-secondary-dark-bg p-6 rounded-lg shadow-md border border-gray-300"
          >
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              {course.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {course.description}
            </p>
            <p className="text-gray-800 dark:text-gray-200 font-semibold mt-2">
              Price: ${course.price}
            </p>
            <div className="flex gap-4 mt-4">
              {/* Open the View Details modal */}
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => openModal(course)}
              >
                View Details
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => enrollInCourse(course._id)}
              >
                Enroll
              </button>
            </div>
          </div>
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
            <p className="text-gray-800 dark:text-gray-200 font-semibold mt-2">
              Price: ${selectedCourse.price}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              {loremText}
            </p>
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
    </div>
  );
}

export default OfferedCourses;
