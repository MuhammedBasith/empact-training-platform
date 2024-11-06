import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, CircularProgress } from '@mui/material';

interface Employee {
  cognitoId: string;
  name: string;
}

interface EmployeeDetailsResponse {
  success: boolean;
  data: Employee[];
}

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id, trainingId, batchId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        let url = `${import.meta.env.VITE_APP_EMPLOYEE_MANAGEMENT_MICROSERVICE}/api/v1/employee-management/emp/${trainingId}`;
        if (batchId) {
          url = `${import.meta.env.VITE_APP_BATCH_MANAGEMENT_MICROSERVICE}/api/v1/batch-management/getEmployeesForBatch/${batchId}`;
        }
        console.log('sdf');
        

        const response = await axios.get<EmployeeDetailsResponse>(url);
        console.log('df');
        

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );
  }

  const handleShowProgress = (cognitoId: string) => {
    navigate(`/admin/managers/${id}/${trainingId}/progress/${cognitoId}`);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Employee Details for Training {trainingId}</Typography>

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

export default EmployeeDetails;
