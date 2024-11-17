import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent, CircularProgress, Button, Skeleton } from '@mui/material';
import { Paper } from "@mui/material";

interface Progress {
  feedback: string;
  progress: number;
  status: string;
  createdAt: string;
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
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const { id, trainingId, cognitoId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data for trainingId:', trainingId, 'and cognitoId:', cognitoId);

        // Fetch employee progress from Training Progress Microservice
        const progressResponse = await axios.get<ProgressDetailsResponse>(
          `${import.meta.env.VITE_APP_TRAINING_PROGRESS_MICROSERVICE}/api/v1/training-progress/${trainingId}/${cognitoId}`
        );

        console.log('Fetched progress data:', progressResponse.data);

        if (Array.isArray(progressResponse.data)) {
          // Filter out items with null or invalid createdAt, and sort by createdAt
          const sortedProgress = progressResponse.data
            .filter((item) => item.createdAt) // Filter out items with null createdAt
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          setProgress(sortedProgress); // Set sorted progress
        } else {
          setError('Invalid response data format');
        }

        setLoading(false);
      } catch (error) {
        setError('An error occurred while fetching data.');
        setLoading(false);
      }
    };

    // Ensure we only fetch data if both trainingId and cognitoId are available
    if (trainingId && cognitoId) {
      fetchData();
    } else {
      setError('Missing trainingId or cognitoId.');
      setLoading(false);
    }
  }, [trainingId, cognitoId]);

  const handleGenerateAiSummary = async () => {
    try {
      setIsGeneratingSummary(true);
      const feedbacks = progress.map((item) => item.feedback).join(' '); 
      console.log(feedbacks);
      

      const response = await axios.post(
        `${import.meta.env.VITE_APP_AI_SUMMARY_GENERATION_MICROSERVICE}/api/v1/summaries/feedbackSummary`,
        { feedbacks }
      );

      console.log(response.data);
      

      if (response.status === 201) {
        setAiSummary(response.data.summary);
      } else {
        setAiSummary('Error generating summary');
      }
    } catch (error) {
      setError('Error generating AI summary.');
    } finally {
      setIsGeneratingSummary(false);
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
    <Paper elevation={3} sx={{ p: 3, margin: '20px auto' }}>
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
          Employee Progress for {localStorage.getItem("empName")}
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

        {/* AI Summary Section */}
        <Typography variant="h6" sx={{ marginTop: 10, marginBottom: 4 }}>
          AI Generated Feedback Summary
        </Typography>

        {/* Loading Skeleton or Animated UI */}
        {isGeneratingSummary ? (
          <Box sx={{ marginTop: 2, padding: 2, background: '#f5f5f5', borderRadius: 2 }}>
            <Skeleton variant="text" width="100%" height={100} />
            <Skeleton variant="text" width="80%" height={50} />
            <Skeleton variant="text" width="60%" height={50} />
          </Box>
        ) : aiSummary ? (
          <Card sx={{ marginTop: 2 }}>
            <CardContent>
              <Typography variant="body1">{aiSummary}</Typography>
            </CardContent>
          </Card>
        ) : (
          <Button variant="contained" color="primary" fullWidth onClick={handleGenerateAiSummary}>
            Generate AI Summary
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default ProgressDetails;
