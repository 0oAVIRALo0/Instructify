import React, { useState, useEffect } from "react";
import axios from "../services/api";
import request from "../services/requests";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

function AllInstructors() {
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [dropdownState, setDropdownState] = useState({});
  const [assignedCourses, setAssignedCourses] = useState({});

  // Fetch Instructors, Courses, and Assigned Courses on mount
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axios.get(request.getInstructors, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        });
        if (response.status === 200) {
          setInstructors(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await axios.get(request.getAllCourses, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        });
        if (response.status === 200) {
          setCourses(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    const fetchAssignedCourses = async () => {
      try {
        const response = await axios.get(request.getAssignedCourses,
          {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        });
        if (response.status === 200) {
          const assigned = response.data.data.reduce((acc, assignment) => {
            acc[assignment.instructorId] = assignment.courseTitle;
            return acc;
          }, {});
          setAssignedCourses(assigned); // Update state with assigned courses
        }
      } catch (error) {
        console.error("Error fetching assigned courses:", error);
      }
    };

    fetchInstructors();
    fetchCourses();
    fetchAssignedCourses();
  }, []); // Empty array ensures these are only fetched once on mount

  // Open dropdown for specific instructor
  const handleDropdownOpen = (id) => {
    setDropdownState({ [id]: true });
  };

  // Close dropdown
  const handleDropdownClose = (id) => {
    setDropdownState({ [id]: false });
  };

  // Assign course to instructor
  const handleAssign = async (instructorId) => {
    if (!selectedCourse) {
      alert("Please select a course to assign!");
      return;
    }
    try {
      const response = await axios.post(
        request.assignCourseToInstructor,
        { instructorId, courseId: selectedCourse },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        console.log("Course assigned successfully:", response.data.data);
        alert("Course assigned successfully!");
        // Update the assigned course in the state after successful assignment
        setAssignedCourses({
          ...assignedCourses,
          [instructorId]: courses.find((course) => course._id === selectedCourse)?.title,
        });
        setSelectedCourse("");
        handleDropdownClose(instructorId);
      }
    } catch (error) {
      console.error("Error assigning course:", error);
      alert("Failed to assign course");
    }
  };

  return (
    <div className="mt-8">
      {instructors.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{
            maxWidth: "90%",
            margin: "0 auto",
            border: "1px solid rgba(169, 169, 169, 0.3)",
            borderRadius: "8px",
          }}
        >
          <Table aria-label="Instructors table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Assigned Course</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {instructors.map((instructor) => (
                <TableRow key={instructor._id}>
                  <TableCell>{instructor.fullName}</TableCell>
                  <TableCell>{instructor.email}</TableCell>
                  <TableCell>{instructor.branch}</TableCell>
                  <TableCell>
                    {assignedCourses[instructor._id] || "No course assigned"}
                  </TableCell>
                  <TableCell align="center">
                    {dropdownState[instructor._id] ? (
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <FormControl sx={{ minWidth: 200 }}>
                          <InputLabel>Select Course</InputLabel>
                          <Select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            onClose={() => handleDropdownClose(instructor._id)}
                          >
                            {courses.map((course) => (
                              <MenuItem key={course._id} value={course._id}>
                                {course.title}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleAssign(instructor._id)}
                        >
                          Confirm
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="contained"
                        color={assignedCourses[instructor._id] ? "error" : "primary"}
                        onClick={() => handleDropdownOpen(instructor._id)}
                      >
                        {assignedCourses[instructor._id] ? "Assign Again" : "Assign"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div>No instructors available</div>
      )}
    </div>
  );
}

export default AllInstructors;
