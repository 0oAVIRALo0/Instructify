import React from 'react'
import axios from "../services/api";
import request from "../services/requests";
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

function AllCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(request.getAllCourses, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        });

        if (response.status === 200) {
          setCourses(response.data.data);
        }
      }
      catch (error) {
        console.error("Error fetching courses:", error);
      }
    }

    fetchCourses();
  } ,[]);

  return (
    <div className='mt-8'>
      {courses.length > 0 ? (
        <TableContainer component={Paper} sx={{ maxWidth: '95%', margin: '0 auto', border: '1px solid rgba(169, 169, 169, 0.3)', borderRadius: '8px' }}>
          <Table aria-label="Courses table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course._id}>
                  <TableCell component="th" scope="row">{course.title}</TableCell>
                  <TableCell>{course.description}</TableCell>
                  <TableCell>{course.price}</TableCell>
                  <TableCell align="center">
                    <Button variant="contained" color="primary">Enroll</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div>No courses available</div>
      )}
    </div>
  )
}

export default AllCourses