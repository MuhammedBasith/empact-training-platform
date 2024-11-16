import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Button, Collapse, MenuItem, Select, FormControl, InputLabel, TableSortLabel } from '@mui/material';
import { useUserContext } from "../../../../context/UserContext"; 

interface Trainer {
  trainerId: string;
  name: string;
  email: string;
  expertise: string[];
}

interface BatchDetail {
  _id: string;
  batchNumber: number;
  duration: string;
  employeeCount: number;
  range: string;
  count: number;  // Employee count in the batch
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

const TrainingDetails = () => {
  const [trainingRequirements, setTrainingRequirements] = useState<TrainingRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set()); // Set to track expanded rows
  const [error, setError] = useState<string | null>(null);
  const [selectedTraining, setSelectedTraining] = useState<string>(''); // State to manage selected training

  const { trainingId } = useParams();  // Get trainingId from path params
  const { user } = useUserContext(); // Get the user context to access cognitoId
  const navigate = useNavigate();  // Hook for programmatic navigation

  useEffect(() => {
    const fetchTrainingDetails = async () => {
      try {
        // Fetch the training details by trainingId and trainer's cognitoId
        const response = await axios.get<ManagerDetailsResponse>(
          `${import.meta.env.VITE_APP_TRAINING_REQUIREMENTS_MICROSERVICE_BACKEND}/api/v1/training-requirements/getTrainingDetails/${trainingId}/${user?.cognitoID}`
        );

        if (response.data.success && response.data.data) {
          setTrainingRequirements(response.data.data);
        } else {
          setError('Failed to fetch training details.');
        }
        setLoading(false);
      } catch (error) {
        setError('An error occurred while fetching data.');
        setLoading(false);
      }
    };

    fetchTrainingDetails();
  }, [trainingId, user?.cognitoID]);

  const handleRowToggle = (trainingId: string, batchId: string) => {
    const newExpandedRows = new Set(expandedRows);
    const key = `${trainingId}-${batchId}`;
    if (newExpandedRows.has(key)) {
      newExpandedRows.delete(key);
    } else {
      newExpandedRows.add(key);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleShowEmployees = (batchId: string) => {
    navigate(`/dashboard/trainer/trainings/${trainingId}/batch/${batchId}`);
  };

  const handleTrainingChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedTraining(event.target.value as string);
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
      <Typography variant="h6">Training Details</Typography>

      {/* Dropdown for Selecting Training */}
      <FormControl sx={{ width: '200px', marginTop: 2 }}>
        <InputLabel id="training-select-label">Select Training</InputLabel>
        <Select
          labelId="training-select-label"
          value={selectedTraining}
          label="Select Training"
          onChange={handleTrainingChange}
        >
          {trainingRequirements.map((training) => (
            <MenuItem key={training._id} value={training._id}>
              {training.trainingName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Display Training Table */}
      {trainingRequirements.filter(training => selectedTraining === '' || training._id === selectedTraining).map((training) => (
        <Box key={training._id} sx={{ mt: 2 }}>
          <Typography variant="h6">{training.trainingName}</Typography>

          {/* Display Batch Details Table */}
          <Table sx={{ marginTop: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Batch Number</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Employee Count</TableCell>
                <TableCell>Trainer</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {training.batchDetails?.map((batch) => (
                <React.Fragment key={batch._id}>
                  <TableRow hover sx={{ cursor: 'pointer' }} onClick={() => handleRowToggle(training._id, batch._id)}>
                    <TableCell>{batch.batchNumber}</TableCell>
                    <TableCell>{batch.duration} Weeks</TableCell>
                    <TableCell>{batch.count}</TableCell>
                    <TableCell>{batch.trainerDetails?.name || 'Trainer not assigned'}</TableCell>
                    <TableCell>
                      <Button variant="outlined" color="primary" onClick={() => handleShowEmployees(batch._id)}>
                        Show Employees
                      </Button>
                    </TableCell>
                  </TableRow>

                  {/* Render expanded batch details */}
                  {expandedRows.has(`${training._id}-${batch._id}`) && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Collapse in={expandedRows.has(`${training._id}-${batch._id}`)} timeout="auto" unmountOnExit>
                          <Box sx={{ paddingLeft: 2 }}>
                            <Typography variant="body2">
                              <strong>Batch Range:</strong> {batch.range}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Trainer:</strong> {batch.trainerDetails?.name || 'Not Assigned'}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Duration:</strong> {batch.duration} Weeks
                            </Typography>
                            <Typography variant="body2">
                              <strong>Employee Count:</strong> {batch.count}
                            </Typography>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </Box>
      ))}
    </Box>
  );
};

export default TrainingDetails;
