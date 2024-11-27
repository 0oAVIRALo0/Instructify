import React, { useEffect, useState } from "react";
import axios from "../services/api";
import request from "../services/requests";
import { LoremIpsum } from "lorem-ipsum"; 
import banner from '../data/banner.jpg'; 
import Card from "./Card";

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
      console.log("Access token:", localStorage.getItem("accessToken"));
      try {
        const response = await axios.get(request.getAllCourses, {
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

  const enrollInCourse = async (courseId) => {
    console.log("Enrolling in course:", courseId);
    try {
      const response = await axios.post(`${request.enrollInCourse}/${courseId}`,
        {},
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
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
          <Card
            key={course._id}
            course={course}
            primaryAction={{
              label: "View Details",
              onClick: () => openModal(course),
            }}
            lastAction={{
              label: "Enroll",
              onClick: () => enrollInCourse(course._id),
            }}
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
