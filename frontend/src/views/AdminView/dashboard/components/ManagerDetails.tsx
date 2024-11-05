import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Button, Collapse } from '@mui/material';

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
  trainingId: string;
  trainingName: string;
  trainer: Trainer | null;
  batchDetails: BatchDetail[] | null;
}

interface ManagerDetailsResponse {
  success: boolean;
  data: TrainingRequirement[];
}

const ManagerDetails = ({ cognitoId }: { cognitoId: string }) => {
  const [trainingRequirements, setTrainingRequirements] = useState<TrainingRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set()); // Set to track expanded rows
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();  // Hook for programmatic navigation

  useEffect(() => {
    const fetchTrainingRequirements = async () => {
      try {
        const response = await axios.get<ManagerDetailsResponse>(
          `${import.meta.env.VITE_APP_TRAINING_REQUIREMENTS_MICROSERVICE_BACKEND}/api/v1/training-requirements/getTrainingRequirementsByManager/${id}`
        );

        if (response.data.success) {
          setTrainingRequirements(response.data.data);
        } else {
          setError('Failed to fetch training requirements.');
        }
        setLoading(false);
      } catch (error) {
        setError('An error occurred while fetching data.');
        setLoading(false);
      }
    };

    fetchTrainingRequirements();
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
    // Navigate to the employee details page with the trainingId and optional batchId
    if (batchId) {
      navigate(`/admin/managers/${id}/${trainingId}/${batchId}`);
    } else {
      navigate(`/admin/managers/${id}/${trainingId}`);
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
              <React.Fragment key={training.trainingId}>
                <TableRow
                  hover
                  onClick={() => handleRowToggle(training.trainingId)} // Toggle on row click
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{training.trainingName}</TableCell>
                  <TableCell>{totalEmployees}</TableCell>
                  <TableCell>
                    {hasBatchDetails ? 'Trainer not specified (Batch-specific)' : training.trainer ? training.trainer.name : 'Trainer not assigned'}
                  </TableCell>
                  <TableCell>
                    {!hasBatchDetails && (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleShowEmployees(training.trainingId)}
                      >
                        Show Employees
                      </Button>
                    )}
                    {hasBatchDetails && training.batchDetails?.map((batch) => (
                      <Button
                        key={batch.batchId}
                        variant="outlined"
                        color="primary"
                        sx={{ ml: 1 }}
                        onClick={() => handleShowEmployees(training.trainingId, batch.batchId)} // Pass batchId when available
                      >
                        Show Employees (Batch {batch.batchNumber})
                      </Button>
                    ))}
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ ml: 1 }}
                      onClick={() => console.log(`Add results for training ID: ${training.trainingId}`)}
                    >
                      Add Results
                    </Button>
                  </TableCell>
                </TableRow>

                {/* Render batch details if available */}
                {hasBatchDetails && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Collapse in={expandedRows.has(training.trainingId)} timeout="auto" unmountOnExit>
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

export default ManagerDetails;
