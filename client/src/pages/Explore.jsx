import React from "react";
import { motion } from "framer-motion";

const Explore = () => {
  return (
    <div>
      {/* Hero Section with Animated Background */}
      <motion.div
        className="relative h-screen flex flex-col justify-center items-center overflow-hidden"
        animate={{
          background: "linear-gradient(135deg, rgba(37,99,235,0.9) 0%, rgba(37,99,235,0.6) 100%)",
        }}
        transition={{
          ease: "easeInOut",
          duration: 3,
        }}
      >
        {/* Animated Gradient Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"
          animate={{
            backgroundPosition: "100% 100%",
          }}
          transition={{
            ease: "easeInOut",
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
          }}
          style={{
            backgroundSize: "200% 200%",
          }}
        ></motion.div>

        <div className="text-center relative z-10">
          {/* Title Animation */}
          <motion.h2
            className="text-5xl font-semibold mb-6 text-white text-shadow-md"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            Start Your Learning Journey
          </motion.h2>

          {/* Subtitle Animation */}
          <motion.p
            className="text-lg max-w-lg mx-auto opacity-90 mb-8 text-white text-shadow-md"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.4, delay: 0.4 }}
          >
            Explore our expert-led courses designed to help you unlock new skills and elevate your career.
          </motion.p>

          {/* Call to Action Text Animation */}
          <motion.h3
            className="text-3xl font-bold mb-6 text-white text-shadow-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.6 }}
          >
            Ready to Start Learning?
          </motion.h3>

          <motion.p
            className="text-xl opacity-90 mb-12 text-white text-shadow-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.8 }}
          >
            Join thousands of learners and start your journey today!
          </motion.p>

          <div className="flex gap-4 justify-center items-center"> 
            <motion.button
              className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-md shadow-lg hover:bg-blue-100 transition duration-300 transform hover:scale-105"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.8, delay: 1 }}
              onClick={() => window.location.href = "/signin"}
            >
              Sign Up Now
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Explore;
