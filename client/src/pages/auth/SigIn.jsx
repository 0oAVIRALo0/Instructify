import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import axios from "../../services/api";
import request from "../../services/requests";

import img from '../../data/img.jpg'

const defaultTheme = createTheme();

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullName] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("fullName", fullname);
      formData.append("password", password);
      formData.append("email", email);

      const response = await axios.post(request.register, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        console.log("Signup successful!");
        console.log("Signup response:", response.data);
        localStorage.setItem("token", response.data.data.accessToken);
        // updateAuthStatus(true);
        navigate("/roleselection");
      } else {
        console.error("Signup failed:", response.data.message);
      }
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-auth_back">
      {/* Flex container for the form and image */}
      <div className="flex items-center justify-center w-full">
        {/* Form Box */}
        <div className="bg-auth_top rounded-lg shadow-lg px-16 py-16 w-full lg:w-2/5">
          {/* Center the text */}
          <div className="flex justify-center mb-8">
            <h1 className="text-4xl font-bold">Welcome to Instructify</h1>
          </div>
          <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <Box className="flex flex-col items-center">
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="fullname"
                    label="Full Name"
                    name="fullname"
                    autoComplete="Full Name"
                    autoFocus
                    value={fullname}
                    onChange={(e) => setFullName(e.target.value)}
                  />

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
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Sign In
                  </Button>

                  {/* <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    href="http://localhost:8000/auth/google" // Replace with your Google OAuth URL
                  >
                    Sign In Using Google
                  </Button> */}

                  <p className="text-neutral-500 mt-4">
                    Already have an account?
                    <Link
                      to="/roleselection"
                      className="text-blue-400 font-semibold text-lg ml-1 hover:underline cursor-pointer"
                    >
                      LogIn
                    </Link>
                  </p>
                </Box>
              </Box>
            </Container>
          </ThemeProvider>
        </div>

        <div className="hidden lg:block lg:w-2/5 h-full bg-cover bg-center rounded-lg">
          <img
            src={ img}
            alt="Sign Up Image"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default SignIn;
