import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper } from "@mui/material";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Collapse,
  IconButton,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

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
  count: number;  // Assuming the 'count' field represents employee count per batch
  trainerDetails: Trainer | null;
}

interface TrainingRequirement {
  _id: string;
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
  const navigate = useNavigate(); // Hook for programmatic navigation

  useEffect(() => {
    const fetchTrainingRequirements = async () => {
      try {
        const response = await axios.get<ManagerDetailsResponse>(
          `${import.meta.env.VITE_APP_TRAINING_REQUIREMENTS_MICROSERVICE_BACKEND}/api/v1/training-requirements/getTrainingRequirementsByManager/${id}`
        );

        if (response.data.success) {
          console.log(response.data.data);
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

  const handleShowEmployees = (trainingId: string, batchId: string) => {
    navigate(`/dashboard/admin/managers/${id}/${trainingId}/${batchId}`);
  };

  const handleAddResults = (trainingId: string) => {
    navigate(`/dashboard/admin/managers/${id}/${trainingId}/results`);
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
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Training Requirements</Typography>

        <Table sx={{ marginTop: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Training Name</TableCell>
              <TableCell>No. of Employees</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trainingRequirements.map((training) => {
              const hasBatchDetails = training.batchDetails && training.batchDetails.length > 0;
              
              // Calculate total employees for training by summing up 'count' from all batches
              const totalEmployees = hasBatchDetails
                ? training.batchDetails?.reduce((sum, batch) => sum + batch.count, 0)
                : 0;

              return (
                <React.Fragment key={training._id}>
                  <TableRow>
                    <TableCell>{training.trainingName}</TableCell>
                    <TableCell>{totalEmployees}</TableCell>
                    <TableCell>
                      {hasBatchDetails ? (
                        <IconButton
                          onClick={() => handleRowToggle(training._id)}
                          aria-expanded={expandedRows.has(training._id)}
                        >
                          {expandedRows.has(training._id) ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      ) : (
                        <>
                        </>
                      )}
                      {/* Show 'Add Employees and Results' button if no batch details */}
                      {!hasBatchDetails && (
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ ml: 2 }}
                          onClick={() => handleAddResults(training._id)}
                        >
                          Add Results
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Render batch details if available */}
                  {hasBatchDetails && (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Collapse in={expandedRows.has(training._id)} timeout="auto" unmountOnExit>
                          <Table sx={{ marginTop: 2 }}>
                            <TableHead>
                              <TableRow>
                                <TableCell>Batch Number</TableCell>
                                <TableCell>Duration</TableCell>
                                <TableCell>Employee Count</TableCell>
                                <TableCell>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {training.batchDetails?.map((batch) => (
                                <TableRow key={batch.batchId}>
                                  <TableCell>{batch.batchNumber}</TableCell>
                                  <TableCell>{batch.duration}</TableCell>
                                  <TableCell>{batch.count}</TableCell> {/* Display count here */}
                                  <TableCell>
                                    <Button
                                      variant="outlined"
                                      color="primary"
                                      onClick={() => handleShowEmployees(training._id, batch._id)}
                                    >
                                      Show Employees (Batch {batch.batchNumber})
                                    </Button>
                                  </TableCell>
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
    </ Paper>
  );
};

export default ManagerDetails;
