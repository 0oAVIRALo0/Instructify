import React, { useEffect, useState } from "react";
import axios from "../services/api";
import request from "../services/requests";
import banner from '../data/banner.jpg'; // Ensure the path is correct`

function EnrolledCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(request.getEnrolledCourses, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => console.log(`Course ID: ${course._id}`)}
              >
                Watch
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => unenrollInCourse(course._id)}
              >
                Unenroll
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EnrolledCourses;
