import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, CircularProgress } from '@mui/material';
import { Paper } from "@mui/material";
// Adjusted Employee interface based on the actual response structure
interface Employee {
  cognitoId: string;
  empName: string;
  empEmail: string;
  empAccount: string;
  empSkills: string;
  department: string;
}


const EmployeeDetails = () => {
  const [employees, setEmployees] = useState<Employee[]>([]); // Typing employees as an array of Employee
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id, trainingId, batchId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // URL to fetch employees for a specific batch
        const url = `${import.meta.env.VITE_APP_BATCH_MANAGEMENT_MICROSERVICE}/api/v1/batch-management/getEmployeesForBatch/${batchId}`;

        // Fetch the employee data
        const response = await axios.get<Employee[]>(url);

        // Log the full response to debug
        console.log("Full response", response);

        // If the response is successful and contains employee data, update the state
        if (response.status === 200 && response.data) {
          // Map over the response data to extract only necessary fields
          const mappedEmployees = response.data.map((employee) => ({
            cognitoId: employee.cognitoId,
            empName: employee.empName,
            empEmail: employee.empEmail,
            empAccount: employee.empAccount,
            empSkills: employee.empSkills,
            department: employee.department,
          }));

          // Set the employees state with the mapped data
          setEmployees(mappedEmployees);
        } else {
          setError('No employees found in this batch.');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching employee data:', error); // Log the actual error
        setError('Failed to fetch employee data.');
        setLoading(false);
      }
    };

    // Call the fetch function
    fetchEmployees();
  }, [trainingId, batchId]); // Dependency array to re-fetch if trainingId or batchId changes

  // If data is still loading, show a loading spinner
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If an error occurred during data fetching, display the error message
  if (error) {
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );
  }

  // Function to handle the "Show Progress" button click
  const handleShowProgress = (cognitoId: string, empName: string) => {
    localStorage.setItem("empName", empName)
    navigate(`/dashboard/admin/managers/${id}/${trainingId}/${batchId}/progress/${cognitoId}`);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, margin: '20px auto' }}>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Employee Details
        </Typography>

        <Table sx={{ marginTop: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Index</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Account</TableCell>
              <TableCell>Skills</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee, index) => (
              <TableRow key={employee.cognitoId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{employee.empName}</TableCell>
                <TableCell>{employee.empEmail}</TableCell>
                <TableCell>{employee.empAccount}</TableCell>
                <TableCell>{employee.empSkills}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleShowProgress(employee.cognitoId, employee.empName)}
                  >
                    Show Progress
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
};

export default EmployeeDetails;
