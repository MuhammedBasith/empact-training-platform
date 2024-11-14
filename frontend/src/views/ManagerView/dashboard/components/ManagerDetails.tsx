import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Button, Collapse, IconButton, Tooltip } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

interface Trainer {
  name: string;
  email: string;
  expertise: string[];
}

interface BatchDetail {
  _id: string;
  batchNumber: number;
  trainerId: string;
  employeeIds: string[];
  duration: string;
  range: string;
  count: number;
  trainerDetails: Trainer | null;
}

interface TrainingRequirement {
  _id: string;
  trainingName: string;
  batchDetails: BatchDetail[] | null;
}

interface ManagerDetailsResponse {
  success: boolean;
  data: TrainingRequirement[];
}

const ManagerDetails = ({ cognitoId }: { cognitoId: string }) => {
  const [trainingRequirements, setTrainingRequirements] = useState<TrainingRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

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
    if (batchId) {
      navigate(`/dashboard/admin/managers/${id}/${trainingId}/${batchId}`);
    } else {
      navigate(`/dashboard/admin/managers/${id}/${trainingId}`);
    }
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
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Training Requirements</Typography>

      <Table sx={{ marginTop: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Training Name</TableCell>
            <TableCell>No. of Batches</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trainingRequirements.map((training) => {
            const hasBatches = training.batchDetails && training.batchDetails.length > 0;

            return (
              <React.Fragment key={training._id}>
                <TableRow
                  hover
                  onClick={() => handleRowToggle(training._id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{training.trainingName}</TableCell>
                  <TableCell>{hasBatches ? training.batchDetails?.length : 'No batches'}</TableCell>
                  <TableCell>
                    {hasBatches && (
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ ml: 1 }}
                        onClick={() => handleAddResults(training._id)}
                      >
                        Add Results
                      </Button>
                    )}
                  </TableCell>
                </TableRow>

                {/* Render batch details if available */}
                {hasBatches && (
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
                              <TableRow key={batch._id}>
                                <TableCell>{batch.batchNumber}</TableCell>
                                <TableCell>{batch.duration}</TableCell>
                                <TableCell>{batch.count}</TableCell>
                                <TableCell>
                                  <Tooltip title="Show Employees">
                                    <IconButton
                                      color="primary"
                                      onClick={() => handleShowEmployees(training._id, batch._id)}
                                    >
                                      <ExpandMore />
                                    </IconButton>
                                  </Tooltip>
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
  );
};

export default ManagerDetails;
