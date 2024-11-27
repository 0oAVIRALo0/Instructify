import React, { useState } from "react";

import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { Header } from ".";

import axios from "../services/api";
import request from "../services/requests";

const defaultTheme = createTheme();

function NewCourse() {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [coursePrice, setCoursePrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", courseTitle);
      formData.append("description", courseDescription);
      formData.append("price", coursePrice);

      const response = await axios.post(request.addCourse, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        withCredentials: true,
      });

      if (response.status === 2001) {
        alert("Meeting request created successfully");
        // console.log("Response:", response.data);
        setCourseTitle("");
        setCourseDescription("");
        setCoursePrice("");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        alert(error.response.data.message);
      }
    }
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="" title="" />
      <div className="flex justify-center bg-auth_back">
        <div className="bg-auth_top rounded-lg shadow-lg px-10 py-16 mt-2 lg:w-2/5 lg:max-w-md w-full">
          <h1 className="text-4xl font-bold">Add a new Course</h1>
          <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <Box className="flex flex-col items-center">
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  className="mt-4"
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="courseTitle"
                    label="Course Title"
                    name="courseTitle"
                    autoComplete="courseTitle"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="courseDescription"
                    label="Course Description"
                    id="courseDescription"
                    multiline
                    rows={4}
                    autoComplete="courseDescription"
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="coursePrice"
                    label="Course Price"
                    name="coursePrice"
                    autoComplete="coursePrice"
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 py-3 text-white rounded-lg w-full mt-6 hover:bg-blue-700 transition"
                  >
                    Submit
                  </button>
                </Box>
              </Box>
            </Container>
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
}

export default NewCourse;
