import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Button, Collapse, Paper } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../../../context/UserContext'

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
    const { user } = useUserContext();



    useEffect(() => {
        const fetchTrainingDetails = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_APP_TRAINING_REQUIREMENTS_MICROSERVICE_BACKEND}/api/v1/training-requirements/getTrainingRequirementsByManager/${user?.cognitoID}`
                );

                if (response.data.success) {
                    console.log(response.data);
                    setTrainingRequirements(response.data.data);
                } else {
                    setTrainingRequirements([]);
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    // Check if the error has a response (i.e., a 404 or other HTTP error)
                    if (error.response) {
                        console.error(`HTTP Error: ${error.response.status}`, error.response.data);
                        if (error.response.status === 404) {
                            console.log("Please add a requirement.");
                            
                        }
                    } else {
                        // If there's no response, it might be a network error or timeout
                        console.error('Network or other error:', error.message);
                    }
                } else {
                    // For non-Axios errors (if they occur)
                    console.error('Unexpected error:', error);
                }

                // Set the state to empty array on error
                setTrainingRequirements([]);
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

    const handleShowEmployees = (trainingId: string, batchId: string) => {
        navigate(`/dashboard/manager/trainings/${cognitoId}/${trainingId}/${batchId}`);
    };

    const handleAddTraining = () => {
        // Navigate to the "Add Training" page
        navigate('/dashboard/manager/trainings/add');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (trainingRequirements.length === 0) {
        return (
            <Paper elevation={3} sx={{ p: 3, margin: '20px auto', textAlign: 'center' }}>

                <Box sx={{ display: 'flex', mt: '20px', justifyContent: 'center', alignItems: 'center', height: '200px' }}>

                    <button

                        className="btn group mb-7 w-full bg-gradient-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow hover:bg-[length:100%_150%] sm:mb-7 sm:w-auto"
                        onClick={handleAddTraining}
                    >
                        Add Training Requirement
                    </button>
                </Box>
            </Paper>
        );
    }

    return (
        <Paper elevation={3} sx={{ p: 3, margin: '20px auto', textAlign: 'center' }}>

            <Box sx={{ mt: 2 }}>

                {/* Add Training Button */}
                <button

                    className="btn group mb-7 w-full bg-gradient-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow hover:bg-[length:100%_150%] sm:mb-7 sm:w-auto"
                    onClick={handleAddTraining}
                >
                    Add Training Requirement
                </button>

                <Table sx={{ marginTop: 2 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Training Name</TableCell>
                            <TableCell>No. of Employees</TableCell>
                            <TableCell>Trainer Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {trainingRequirements.map((training) => {
                            const hasBatchDetails = training.batchDetails && training.batchDetails.length > 0;
                            const totalEmployees = hasBatchDetails
                                ? training.batchDetails?.reduce((sum, batch) => sum + batch.employeeCount, 0)
                                : training.batchDetails?.[0]?.employeeCount || 0;

                            return (
                                <React.Fragment key={training._id}>
                                    <TableRow hover onClick={() => handleRowToggle(training._id)} sx={{ cursor: 'pointer' }}>
                                        <TableCell>{training.trainingName}</TableCell>
                                        <TableCell>{totalEmployees}</TableCell>
                                        <TableCell>{training.trainer ? training.trainer.name : 'Trainer not assigned'}</TableCell>
                                    </TableRow>

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
                                                                <TableCell>Trainer</TableCell>
                                                                <TableCell>Actions</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {training.batchDetails?.map((batch) => (
                                                                <TableRow key={batch.batchId}>
                                                                    <TableCell>{batch.batchNumber}</TableCell>
                                                                    <TableCell>{batch.duration}</TableCell>
                                                                    <TableCell>{batch.employeeCount}</TableCell>
                                                                    <TableCell>{batch.trainer ? batch.trainer.name : 'Trainer not assigned'}</TableCell>
                                                                    <TableCell>
                                                                        <Button
                                                                            variant="outlined"
                                                                            color="primary"
                                                                            onClick={() => handleShowEmployees(training._id, batch.batchId)}
                                                                        >
                                                                            Show Employees
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

        </Paper>
    );
};

export default ManagerInsights;
