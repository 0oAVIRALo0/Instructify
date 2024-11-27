import React, { useEffect, createContext, useContext, useState } from "react";

import axios from "../services/api";
import request from "../services/requests";

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

export const ContextProvider = ({
  children,
  userData,
  setUserData,
  isLoggedIn,
  setIsLoggedIn,
}) => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState("#03C9D7");
  const [currentMode, setCurrentMode] = useState("Light");
  const [themeSettings, setThemeSettings] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          setIsLoggedIn(true);
          const response = await axios.get(request.getCurreantUser, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
            withCredentials: true,
          });
          // console.log("User details:", response.data.data);
          const { fullName, username, email, role } = response.data.data;
          setUserData({ fullName, email, role, username });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchData();
  }, [isLoggedIn]);

  const setMode = (e) => {
    setCurrentMode(e.target.value);
    localStorage.setItem("themeMode", e.target.value);
  };

  const setColor = (color) => {
    setCurrentColor(color);
    localStorage.setItem("colorMode", color);
  };

  const handleClick = (clicked) => {
    setIsClicked((prevState) => ({
      ...prevState,
      [clicked]: !prevState[clicked],
    }));
  };

  const logout = async () => {
    try {
      const response = await axios.post(request.logout, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
      })

      console.log("Logout response:", response);

      if (response.status === 200) {
        console.log("Logged out successfull")
        localStorage.removeItem("accessToken");
        setIsLoggedIn(false);
        setUserData({});
      } else {
        console.error("Error logging out:", response.data.message);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const updateAuthStatus = (status) => {
    setIsLoggedIn(status);
  };

  const setUserDataState = (details) => {
    setUserData((prevDetails) => ({
      ...prevDetails,
      ...details,
    }));
  };

  return (
    <StateContext.Provider
      value={{
        activeMenu,
        isClicked,
        screenSize,
        currentColor,
        currentMode,
        themeSettings,
        isLoggedIn,
        userData,
        setActiveMenu,
        setIsClicked,
        handleClick,
        setScreenSize,
        setCurrentColor,
        setCurrentMode,
        setThemeSettings,
        setMode,
        setColor,
        logout,
        updateAuthStatus,
        setUserData: setUserDataState,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
