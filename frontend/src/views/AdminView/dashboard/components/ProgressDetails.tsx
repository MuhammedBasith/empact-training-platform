import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent, CircularProgress, Button } from '@mui/material';

interface Progress {
  feedback: string;
  progress: number;
  status: string;
  startedAt: string;
  completedAt: string;
  trainerName: string;
}

interface Employee {
  cognitoId: string;
  name: string;
  email: string;
  project: string;
  skills: string;
  department: string;
}

interface ProgressDetailsResponse {
  success: boolean;
  data: Progress[];
}

const ProgressDetails = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id, trainingId, cognitoId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch employee details from Employee Management Microservice
        const employeeResponse = await axios.get(`${import.meta.env.VITE_APP_TRAINING_PROGRESS_MICROSERVICE}/api/v1/training-progress/${trainingId}/${cognitoId}`);
        if (employeeResponse.data.success) {
          setEmployee(employeeResponse.data.data);
        } else {
          setError('Failed to fetch employee details.');
        }

        // Fetch employee progress from Training Progress Microservice
        const progressResponse = await axios.get<ProgressDetailsResponse>(
          `${import.meta.env.VITE_APP_TRAINING_PROGRESS_MICROSERVICE}/api/v1/training-progress/${trainingId}/${cognitoId}`
        );
        if (progressResponse.data.success) {
          setProgress(progressResponse.data.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())); // Sort by date
        } else {
          setError('Failed to fetch progress data.');
        }

        setLoading(false);
      } catch (error) {
        setError('An error occurred while fetching data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [trainingId, cognitoId]);

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

  return (
    <Box sx={{ mt: 2, maxWidth: '800px', margin: 'auto' }}>
      {/* Employee Information Section */}
      {employee && (
        <Card sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h5">{employee.name}</Typography>
            <Typography variant="body1" color="text.secondary">
              Email: {employee.email}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Project: {employee.project}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Skills: {employee.skills}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Department: {employee.department}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Employee Progress Section */}
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Employee Progress for {employee?.name}
      </Typography>

      {progress.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No progress feedback available.
        </Typography>
      ) : (
        progress.map((item, index) => (
          <Card key={index} sx={{ marginTop: 2 }}>
            <CardContent>
              <Typography variant="h6">Feedback from Trainer: {item.trainerName}</Typography>
              <Typography variant="body1" color="text.secondary">
                {item.feedback}
              </Typography>
              <Typography variant="body1" color="primary">
                Progress: {item.progress}% - Status: {item.status}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Started at: {new Date(item.startedAt).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed at: {item.completedAt ? new Date(item.completedAt).toLocaleString() : 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default ProgressDetails;
