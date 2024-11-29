import { motion } from "framer-motion";
import { useState } from "react";
import axios from "../services/api";
import request from "../services/requests";
import { useNavigate } from "react-router";

const Verification = () => {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState("");

  const handleInputChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleSubmit = async () => {
    // console.log("Verifying code:", verificationCode);
    try {
      const formData = new FormData();
      formData.append("verificationCode", verificationCode);

      const response = await axios.post(request.verify, formData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
        },
        withCredentials: true,
      });

      // console.log("Verification response:", response);

      if (response.status === 200) {
        // console.log("Verification successful");
        navigate("/roleselection");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      alert("Failed to verify code.");
    }
  };

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
            Verify Your Email
          </motion.h2>

          {/* Subtitle Animation */}
          <motion.p
            className="text-lg max-w-lg mx-auto opacity-90 mb-8 text-white"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.4, delay: 0.4 }}
          >
            Please enter the verification code sent to your email.
          </motion.p>

          {/* Input and Button Section */}
          <div className="flex flex-col gap-6 justify-center items-center">
            {/* Verification Code Input Field */}
            <motion.input
              type="text"
              placeholder="Enter Verification Code"
              value={verificationCode}
              onChange={handleInputChange}
              className="px-4 py-3 text-lg rounded-md w-80 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.6 }}
            />
            
            {/* Submit Button */}
            <motion.button
              className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-md shadow-lg hover:bg-blue-600 hover:text-white transition duration-300 transform hover:scale-105"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.8, delay: 1 }}
              onClick={handleSubmit}
            >
              Verify Code
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Verification;
