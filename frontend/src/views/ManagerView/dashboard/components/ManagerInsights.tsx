import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Button, Collapse } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

interface Trainer {
  trainerId: string;
  name: string;
  email: string;
  expertise: string[];
}

interface BatchDetail {
  batchId: string;
  batchNumber: number;
  duration: string;
  employeeCount: number;
  range: string;
  trainer: Trainer | null;
}

interface TrainingRequirement {
  _id: string;
  trainingName: string;
  trainer: Trainer | null;
  batchDetails: BatchDetail[] | null;
}

const ManagerInsights = () => {
  const { cognitoId } = useParams(); // Get the cognitoId from the URL params
  const [trainingRequirements, setTrainingRequirements] = useState<TrainingRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainingDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_TRAINING_REQUIREMENTS_MICROSERVICE_BACKEND}/api/v1/training-requirements/getTrainingRequirementsByManager/${cognitoId}`
        );

        if (response.data.success) {
          setTrainingRequirements(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching training details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingDetails();
  }, [cognitoId]);

  const handleRowToggle = (trainingId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(trainingId)) {
      newExpandedRows.delete(trainingId);
    } else {
      newExpandedRows.add(trainingId);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleShowEmployees = (trainingId: string, batchId?: string) => {
    navigate(`/dashboard/admin/managers/${cognitoId}/${trainingId}${batchId ? `/${batchId}` : ''}`);
  };

  const handleAddResults = (trainingId: string) => {
    navigate(`/dashboard/admin/managers/${cognitoId}/${trainingId}/results`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Training Requirements</Typography>
      <Table sx={{ marginTop: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Training Name</TableCell>
            <TableCell>No. of Employees</TableCell>
            <TableCell>Trainer Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trainingRequirements.map((training) => {
            const hasBatchDetails = training.batchDetails && training.batchDetails.length > 0;
            const totalEmployees = hasBatchDetails
              ? training.batchDetails.reduce((sum, batch) => sum + batch.employeeCount, 0)
              : training.batchDetails?.[0]?.employeeCount || 0;

            return (
              <React.Fragment key={training._id}>
                <TableRow hover onClick={() => handleRowToggle(training._id)} sx={{ cursor: 'pointer' }}>
                  <TableCell>{training.trainingName}</TableCell>
                  <TableCell>{totalEmployees}</TableCell>
                  <TableCell>{training.trainer ? training.trainer.name : 'Trainer not assigned'}</TableCell>
                  <TableCell>
                    <Button variant="outlined" color="primary" onClick={() => handleShowEmployees(training._id)}>
                      Show Employees
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ ml: 1 }}
                      onClick={() => handleAddResults(training._id)}
                    >
                      Add Results
                    </Button>
                  </TableCell>
                </TableRow>

                {hasBatchDetails && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Collapse in={expandedRows.has(training._id)} timeout="auto" unmountOnExit>
                        <Table sx={{ marginTop: 2 }}>
                          <TableHead>
                            <TableRow>
                              <TableCell>Batch Number</TableCell>
                              <TableCell>Duration</TableCell>
                              <TableCell>Employee Count</TableCell>
                              <TableCell>Trainer</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {training.batchDetails?.map((batch) => (
                              <TableRow key={batch.batchId}>
                                <TableCell>{batch.batchNumber}</TableCell>
                                <TableCell>{batch.duration}</TableCell>
                                <TableCell>{batch.employeeCount}</TableCell>
                                <TableCell>{batch.trainer ? batch.trainer.name : 'Trainer not assigned'}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ManagerInsights;
