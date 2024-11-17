import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent, CircularProgress, Button, TextField, MenuItem, Select, FormControl, InputLabel, Grid } from '@mui/material';
import { Paper } from "@mui/material";
import { useUserContext } from '../../../../context/UserContext';

interface Progress {
  feedback: string;
  progress: number;
  status: string;
  createdAt: string;
  trainerName?: string;
}

interface Employee {
  cognitoId: string;
  name: string;
  email: string;
  project: string;
  skills: string;
  department: string;
}


const ProgressDetails = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [status, setStatus] = useState<'not started' | 'in progress' | 'completed'>('not started');
  const { trainingId, cognitoId, batchId } = useParams();
  const { user } = useUserContext()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch employee progress from Training Progress Microservice
        const progressResponse = await axios.get<Progress[]>(
          `${import.meta.env.VITE_APP_TRAINING_PROGRESS_MICROSERVICE}/api/v1/training-progress/${trainingId}/${cognitoId}`
        );

        console.log(progressResponse.data);  // This will now be an array directly

        if (Array.isArray(progressResponse.data)) {
          const sortedProgress = progressResponse.data
            .filter(item => item.createdAt)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          setProgress(sortedProgress);
        } else {
          setError('Invalid response data format');
        }

        setLoading(false);
      } catch (error) {
        setError('An error occurred while fetching data.');
        setLoading(false);
      }
    };

    if (trainingId && cognitoId) {
      fetchData();
    } else {
      setError('Missing trainingId or cognitoId.');
      setLoading(false);
    }
  }, [trainingId, cognitoId]);


  const handleFeedbackSubmit = async () => {
    try {
      const newFeedback = {
        batchId,
        trainerId: user?.cognitoID,
        trainingId,
        cognitoId,
        feedback: feedbackText,
        progress: progressPercentage,
        status,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_APP_TRAINING_PROGRESS_MICROSERVICE}/api/v1/training-progress/`,
        newFeedback
      );

      console.log(response.status);
      
      if (response.status === 201) {
        // Add the new feedback to the state and reset form
        setProgress([
          ...progress,
          { ...newFeedback, createdAt: new Date().toISOString()},
        ]);
        setFeedbackText('');
        setProgressPercentage(0);
        setStatus('not started');
      }
    } catch (error) {
      setError('Error submitting feedback.');
    }
  };

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
    <Paper elevation={3} sx={{ p: 3, margin: '20px auto', maxWidth: '900px' }}>
      <Box sx={{ mt: 2 }}>
        {/* Employee Information */}
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

        {/* Employee Progress */}
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Employee Progress for {employee?.name || 'Employee'}
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
                  Given at: {new Date(item.createdAt).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}

        {/* Add New Feedback */}
        <Typography variant="h6" sx={{ marginTop: 4 }}>
          Add New Feedback
        </Typography>

        <Box sx={{ mt: 2 }}>
          <TextField
            label="Feedback"
            multiline
            rows={4}
            fullWidth
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Progress (%)"
            type="number"
            fullWidth
            value={progressPercentage}
            onChange={(e) => setProgressPercentage(Number(e.target.value))}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'not started' | 'in progress' | 'completed')}
            >
              <MenuItem value="not started">Not Started</MenuItem>
              <MenuItem value="in progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleFeedbackSubmit}
          >
            Submit Feedback
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProgressDetails;
