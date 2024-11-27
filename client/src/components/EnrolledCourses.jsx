import React, { useEffect, useState } from "react";
import axios from "../services/api";
import request from "../services/requests";
import banner from '../data/banner.jpg'; 
import Card from "./Card";
import { loremIpsum } from "lorem-ipsum";

function EnrolledCourses() {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [dynamicDescription, setDynamicDescription] = useState(""); 

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(request.getEnrolledCourses, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          withCredentials: true,
        });

        if (response.status === 200) {
          // console.log("Courses:", response.data.data);
          setCourses(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        if (error.response.status === 401) {
          alert("Please log in to view your enrolled courses!");
        }
      }
    };

    fetchCourses();
  }, []);

  const unenrollInCourse = async (courseId) => { 
    try {
      const response = await axios.delete(`${request.unenrollInCourse}/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert("Successfully unenrolled from the course!");
        setCourses(courses.filter((course) => course._id !== courseId));
        console.log("Enrolled Courses:", courses);
      }
    } catch (error) {
      console.error("Error unenrolling from course:", error);
      if (error.response.status === 401) {
        alert("Please log in to unenroll from the course!");
      }
    }
  };

  const generateLoremIpsum = (paragraphs = 2) => {
    return loremIpsum({
      count: paragraphs, 
      units: "paragraphs",
      format: "plain",
    });
  };

  const openModal = (course) => {
    setSelectedCourse(course);
    setDynamicDescription(generateLoremIpsum(1)); 
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
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
            <p className="font-bold text-gray-500 text-xl">Number of Courses Enrolled in: </p>
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
            tertiaryAction={{
              label: "Unenroll",
              onClick: () => unenrollInCourse(course._id),
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
    </div>
  );
}

export default EnrolledCourses;
