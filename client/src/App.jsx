import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Import Navigate for redirection

import LinearProgress from "@mui/material/LinearProgress";
import { FiSettings } from "react-icons/fi";

import { Navbar, Sidebar, ThemeSettings, AddCourse, OfferedCourses, EnrolledCourses } from "./components";
import { Explore, Courses, Calendar, LogIn, SignIn, Error, Role } from "./pages";

import { useStateContext } from "./contexts/ContextProvider";

import "./App.css";

const App = () => {
  const { setCurrentColor, setCurrentMode, currentMode, activeMenu, currentColor, themeSettings, setThemeSettings, isLoggedIn, userData } = useStateContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("colorMode");
    const currentThemeMode = localStorage.getItem("themeMode");
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LinearProgress />;
  }

  if (!isLoggedIn) {
    // If user is not logged in, show only the unauthenticated pages
    return (
      <Routes>
        <Route path="/" element={<Explore />} /> {/* Default Route */}
        <Route path="/explore" element={<Explore />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/roleselection" element={<Role />} />
        <Route path="*" element={<Error />} /> {/* Catch-all Error Route */}
      </Routes>
    );
  }

  // If user is logged in, show the main dashboard and other restricted pages
  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <div className="flex relative dark:bg-main-dark-bg">
        <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
          <button
            type="button"
            className="text-3xl p-3 hover:bg-light-gray text-white"
            onClick={() => setThemeSettings(true)}
            style={{ background: currentColor, borderRadius: "50%" }}
          >
            <FiSettings />
          </button>
        </div>
        <div
          className={`dark:bg-secondary-dark-bg ${
            activeMenu ? "w-72 fixed sidebar bg-white" : "w-0"
          }`}
        >
          {activeMenu && <Sidebar />}
        </div>

        <div
          className={
            activeMenu
              ? "dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full "
              : "bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2 "
          }
        >
          <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
            <Navbar />
          </div>
          <div>
            {themeSettings && <ThemeSettings />}

            <Routes>
              <Route path="/mycourses" element={<Courses />} />
              <Route path="/addcourse" element={<AddCourse />} />
              <Route path="/offeredcourses" element={<OfferedCourses />} />
              <Route path="/enrolledcourses" element={<EnrolledCourses />} />
              <Route path="/calendar" element={<Calendar />} />

              {/* Fallback Error Page */}
              <Route path="*" element={<Error />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
