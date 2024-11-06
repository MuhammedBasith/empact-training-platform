import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

interface Employee {
  cognitoId: string;
  name: string;
}

interface EmployeeDetailsResponse {
  success: boolean;
  data: Employee[];
}

const EmployeeDetailsForManagers = () => {
  const { cognitoId, trainingId, batchId } = useParams(); // Get the necessary parameters from the URL
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // URL to fetch employee data based on trainingId and batchId
        let url = `${import.meta.env.VITE_APP_EMPLOYEE_MANAGEMENT_MICROSERVICE}/api/v1/employee-management/emp/${trainingId}`;
        if (batchId) {
          url = `${import.meta.env.VITE_APP_BATCH_MANAGEMENT_MICROSERVICE}/api/v1/batch-management/getEmployeesForBatch/${batchId}`;
        }

        const response = await axios.get<EmployeeDetailsResponse>(url);

        if (response.data.success) {
          setEmployees(response.data.data);
        } else {
          setError('Failed to fetch employee data.');
        }
        setLoading(false);
      } catch (error) {
        setError('An error occurred while fetching employee data.');
        setLoading(false);
      }
    };

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

  // Show error message if there's an issue
  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  // Handle progress button click to navigate to the progress page
  const handleShowProgress = (cognitoId: string) => {
    navigate(`/dashboard/manager/${cognitoId}/${trainingId}/${batchId}/progress`);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Employee Details for Training {trainingId} - Batch {batchId}</Typography>

      <Table sx={{ marginTop: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Index</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee, index) => (
            <TableRow key={employee.cognitoId}>
              {/* Add the index as the first column */}
              <TableCell>{index + 1}</TableCell>
              <TableCell>{employee.name}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleShowProgress(employee.cognitoId)}
                >
                  Show Progress
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default EmployeeDetailsForManagers;
