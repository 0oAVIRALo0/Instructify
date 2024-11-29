import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import axios from "../../services/api";
import request from "../../services/requests";

import img from '../../data/img.jpg'

import { useStateContext } from "../../contexts/ContextProvider";

const defaultTheme = createTheme();

function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { updateAuthStatus } = useStateContext();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await axios.post(request.login, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        // Set the token and user data in localStorage
        localStorage.setItem("accessToken", response.data.data.accessToken);
        updateAuthStatus(true);
        
        // Redirect based on the role
        if (response.data.data.user.role === "student") {
          navigate("/offeredcourses");
        } else if (response.data.data.user.role === "instructor") {
          navigate("/mycourses");
        } else if (response.data.data.user.role === "admin") {
          navigate("/dashboard");
        }
      } else {
        console.error("Login Failed:", response.data.message);
      }
    } catch (error) {
      console.error("Login Failed:", error);
    }

    setUsername("");
    setPassword("");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-auth_back">
      <div className="flex items-center justify-center w-full">
        {/* Form Box */}
        <div className="bg-auth_top rounded-lg shadow-lg px-16 py-16 w-full lg:w-2/5">
          <h1 className="text-4xl font-bold text-center mb-8">Welcome to Instructify</h1>
          <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <Box className="flex flex-col items-center">
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 py-3 text-white rounded-lg w-full mt-6 hover:bg-blue-700 transition"
                  >
                    Login
                  </button>

                  <p className="text-neutral-500 mt-4">
                    Don't have an account?{" "}
                    <a
                      href="/signin"
                      className="text-blue-400 font-semibold text-lg ml-1 hover:underline cursor-pointer"
                    >
                      Register
                    </a>
                  </p>
                </Box>
              </Box>
            </Container>
          </ThemeProvider>
        </div>

        {/* Image next to the form */}
        <div className="hidden lg:block lg:w-2/5 h-full bg-cover bg-center rounded-lg">
          <img
            src={ img}  // Path relative to public folder
            alt="Login Image"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default LogIn;
