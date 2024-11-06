import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import DashboardCard from '../../../../components/shared/DashboardCard';
import { useUserContext } from '../../../../context/UserContext'; // Import the UserContext

const ManagerInsights = () => {
  const { user } = useUserContext(); // Access the logged-in user's context
  const [trainingRequirements, setTrainingRequirements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return; // Exit if no user is found in context
    }

    const fetchTrainingData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_TRAINING_REQUIREMENTS_MICROSERVICE_BACKEND}/api/v1/training-requirements/getTrainingRequirementsByManager/${user.cognitoID}`
        );
        
        if (response.data.success) {
          setTrainingRequirements(response.data.data);
        } else {
          console.error('Failed to fetch training requirements');
        }
      } catch (error) {
        console.error("Error fetching manager's training data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingData();
  }, [user]); // Re-fetch when the user context changes

  if (loading) {
    return (
      <DashboardCard title="Manager's Training Data">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </Box>
      </DashboardCard>
    );
  }

  if (trainingRequirements.length === 0) {
    return (
      <DashboardCard title="Manager's Training Data">
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h6" color="textSecondary">
            No training data available for this manager.
          </Typography>
        </Box>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Manager's Training Data">
      <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
        <Table aria-label="training requirements table" sx={{ whiteSpace: 'nowrap', mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Training Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  No. of Employees
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Trainer
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Action
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trainingRequirements.map((training) => (
              <TableRow key={training._id}>
                <TableCell>
                  <Typography sx={{ fontSize: '15px', fontWeight: '500' }}>
                    {training.trainingName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {training.employeeCount}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {training.trainer ? training.trainer.name : 'Not Assigned'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ transition: 'all 0.3s ease', '&:hover': { transform: 'scale(1.05)' } }}
                    onClick={() => {
                      // Navigate to the details page for this training
                      // Replace `/dashboard/admin/managers/details/${training._id}` with your details route
                      window.location.href = `/dashboard/admin/managers/details/${training._id}`;
                    }}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </DashboardCard>
  );
};

export default ManagerInsights;
