import React from 'react'
import axios from "../services/api";
import request from "../services/requests";
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

function AllStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(request.getStudents, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        });

        if (response.status === 200) {
          setStudents(response.data.data);
        }
      }
      catch (error) {
        console.error("Error fetching students:", error);
      }
    }

    fetchStudents();
  }, []);
  
  return (
    <div className='mt-8'>
      {students.length > 0 ? (
        <TableContainer component={Paper} sx={{ maxWidth: '90%', margin: '0 auto', border: '1px solid rgba(169, 169, 169, 0.3)', borderRadius: '8px' }}>
          <Table aria-label="Students table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student._id}>
                  <TableCell component="th" scope="row">{student.fullName}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.branch}</TableCell>
                  <TableCell align="center">
                    <Button variant="contained" color="error">Unenroll</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div>No students available</div>
      )}
    </div>
  )
}

export default AllStudents