import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, CircularProgress, Paper } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

// Define the employee interface based on the expected response structure
interface Employee {
  cognitoId: string;
  name: string;
  empName: string
  empEmail: string
}

const EmployeeDetailsForManagers = () => {
  const { cognitoId, trainingId, batchId } = useParams<{ cognitoId: string; trainingId: string; batchId: string }>(); 
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // Construct the URL to fetch employee data based on the trainingId and batchId
        const url = `${import.meta.env.VITE_APP_BATCH_MANAGEMENT_MICROSERVICE}/api/v1/batch-management/getEmployeesForBatch/${batchId}`;

        const response = await axios.get(url);
        console.log(response.data, response.status);
        

        if (response.status === 200) {
          setEmployees(response.data);
        } else {
          setError('Failed to fetch employee data.');
        }
        setLoading(false);
      } catch (error) {
        setError('An error occurred while fetching employee data.');
        setLoading(false);
      }
    };

    // Fetch employees on component mount or when batchId or trainingId changes
    fetchEmployees();
  }, [trainingId, batchId]);

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error message if there's an issue fetching the data
  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  // Handle progress button click to navigate to the progress page
  const handleShowProgress = (cognitoId: string, employeeName: string) => {
    localStorage.setItem("empName", employeeName)
    navigate(`/dashboard/manager/trainings/${cognitoId}/${trainingId}/${batchId}/progress`);
  };


  return (
    <Paper elevation={3} sx={{ p: 3, margin: '20px auto' }}>
      <Box sx={{ mt: 2 }}>
        {/* Employees Table */}
        <Table sx={{ marginTop: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Index</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee, index) => (
              <TableRow key={employee.cognitoId}>
                {/* Add the index as the first column */}
                <TableCell>{index + 1}</TableCell>
                <TableCell>{employee.empName}</TableCell>
                <TableCell>{employee.empEmail}</TableCell>
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

export default EmployeeDetailsForManagers;
