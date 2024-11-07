import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Button, Collapse } from '@mui/material';
import { useUserContext } from "../../../../context/UserContext"; 

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

interface ManagerDetailsResponse {
  success: boolean;
  data: TrainingRequirement | null;
}

const TrainingDetails = () => {
  const [trainingRequirement, setTrainingRequirement] = useState<TrainingRequirement | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set()); // Set to track expanded rows
  const [error, setError] = useState<string | null>(null);

  const { trainingId } = useParams();  // Get trainingId from path params
  const { user } = useUserContext(); // Get the user context to access cognitoId
  const navigate = useNavigate();  // Hook for programmatic navigation

  useEffect(() => {
    const fetchTrainingDetails = async () => {
      try {
        // Fetch the training details by trainingId and trainer's cognitoId
        const response = await axios.get<ManagerDetailsResponse>(
          `${import.meta.env.VITE_APP_EMPLOYEE_MANAGEMENT_MICROSERVICE}/api/v1/training-requirements/getTrainingDetails/${trainingId}/${user.cognitoID}`
        );

        if (response.data.success && response.data.data) {
          setTrainingRequirement(response.data.data);
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
  }, [trainingId, user.cognitoID]);

  const handleRowToggle = (batchId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(batchId)) {
      newExpandedRows.delete(batchId);
    } else {
      newExpandedRows.add(batchId);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleShowEmployees = (batchId: string) => {
    // Navigate to employee details page for this batch
    navigate(`/dashboard/trainer/trainings/${trainingId}/batch/${batchId}`);
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
      <Typography variant="h6">Training: {trainingRequirement?.trainingName}</Typography>

      {trainingRequirement?.batchDetails && trainingRequirement.batchDetails.length > 0 ? (
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
            {trainingRequirement.batchDetails.map((batch) => (
              <React.Fragment key={batch.batchId}>
                <TableRow
                  hover
                  onClick={() => handleRowToggle(batch.batchId)} // Toggle on row click
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{batch.batchNumber}</TableCell>
                  <TableCell>{batch.duration}</TableCell>
                  <TableCell>{batch.employeeCount}</TableCell>
                  <TableCell>{batch.trainer ? batch.trainer.name : 'Trainer not assigned'}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleShowEmployees(batch.batchId)} 
                    >
                      Show Employees
                    </Button>
                  </TableCell>
                </TableRow>

                {/* Render batch details if expanded */}
                <TableRow>
                  <TableCell colSpan={5}>
                    <Collapse in={expandedRows.has(batch.batchId)} timeout="auto" unmountOnExit>
                      <Box sx={{ paddingLeft: 2 }}>
                        <Typography variant="body2">
                          <strong>Batch Range:</strong> {batch.range}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Trainer:</strong> {batch.trainer ? batch.trainer.name : 'Not Assigned'}
                        </Typography>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography variant="h6" color="textSecondary">
          No batches available for this training.
        </Typography>
      )}
    </Box>
  );
};

export default TrainingDetails;
