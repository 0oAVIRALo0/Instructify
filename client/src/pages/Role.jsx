import React from "react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "../services/api";
import request from "../services/requests";
import { useNavigate } from "react-router";
import { useStateContext } from "../contexts/ContextProvider";
import { useLocation } from "react-router-dom";

const Role = () => {
  const { updateAuthStatus } = useStateContext();
  const navigate = useNavigate();

  const handleClick = async (role) => {
    try {
      const formData = {
        role: role,
      }

      const response = await axios.put(request.applyRole, formData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
      })

      if (response.status === 200) {
        console.log("Role applied successfully!");
        if (role === "student") {
          updateAuthStatus(true);
          navigate("/offeredcourses");
        }
        else {
          updateAuthStatus(true);
          navigate("/mycourses");
        }
      }
    } catch (error) {
      console.error("Role application failed:", error);
      if (error.response) {
        console.error("Error response:", error.response.data.message);
      }
    }
  }

  return (
    <div>
      {/* Hero Section with Blue Background */}
      <motion.div
        className="relative h-screen flex flex-col justify-center items-center overflow-hidden bg-blue-600"
        animate={{
          background: "linear-gradient(135deg, rgba(37,99,235,0.9) 0%, rgba(37,99,235,0.6) 100%)",
        }}
        transition={{
          ease: "easeInOut",
          duration: 3,
        }}
      >
        {/* Title and Subtitle */}
        <div className="text-center relative z-10">
          {/* Title Animation */}
          <motion.h2
            className="text-5xl font-semibold mb-6 text-white"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            Choose Your Role
          </motion.h2>

          {/* Subtitle Animation */}
          <motion.p
            className="text-lg max-w-lg mx-auto opacity-90 mb-8 text-white"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.4, delay: 0.4 }}
          >
            Select a role to get started with your learning or teaching journey.
          </motion.p>

          {/* Buttons Section */}
          <div className="flex gap-8 justify-center items-center"> 
            {/* Student Button */}
            <motion.button
              className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-md shadow-lg hover:bg-blue-600 hover:text-white transition duration-300 transform hover:scale-105"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.8, delay: 1 }}
              onClick={() => handleClick("student")}
            >
              Student
            </motion.button>
            
            {/* Instructor Button */}
            <motion.button
              className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-md shadow-lg hover:bg-blue-600 hover:text-white transition duration-300 transform hover:scale-105"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.8, delay: 1 }}
              onClick={() => handleClick("instructor")}
            >
              Instructor
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Role;
