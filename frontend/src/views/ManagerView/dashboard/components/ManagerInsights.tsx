import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Button, Collapse, Paper, IconButton } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../../../context/UserContext';

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
    count: number;
    range: string;
    trainerDetails: Trainer | null;
}

interface TrainingRequirement {
    _id: string;
    trainingName: string;
    trainer: Trainer | null;
    batchDetails: BatchDetail[] | null;
}


const ManagerInsights = () => {
    const { user } = useUserContext(); // Get the manager's info from the context
    const [trainingRequirements, setTrainingRequirements] = useState<TrainingRequirement[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrainingDetails = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_APP_TRAINING_REQUIREMENTS_MICROSERVICE_BACKEND}/api/v1/training-requirements/getTrainingRequirementsByManager/${user?.cognitoID}`
                );

                if (response.data.success) {
                    setTrainingRequirements(response.data.data);
                } else {
                    setTrainingRequirements([]);
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    if (error.response) {
                        console.error(`HTTP Error: ${error.response.status}`, error.response.data);
                    } else {
                        console.error('Network or other error:', error.message);
                    }
                }
                setTrainingRequirements([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTrainingDetails();
    }, [user?.cognitoID]);

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
        navigate(`/dashboard/manager/trainings/${user?.cognitoID}/${trainingId}/${batchId}`);
    };

    const handleAddTraining = () => {
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

                <Table sx={{ marginTop: 2, border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Training Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>No. of Employees</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {trainingRequirements.map((training) => {
                            const hasBatchDetails = training.batchDetails && training.batchDetails.length > 0;
                            const totalEmployees = hasBatchDetails
                                ? training.batchDetails?.reduce((sum, batch) => sum + batch.count, 0)
                                : 0;

                            return (
                                <React.Fragment key={training._id}>
                                    <TableRow hover sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f0f0f0' } }}>
                                        <TableCell sx={{ border: '1px solid #ddd' }}>{training.trainingName}</TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd' }}>{totalEmployees}</TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd' }}>
                                            {hasBatchDetails ? (
                                                <IconButton
                                                    onClick={() => handleRowToggle(training._id)}
                                                    aria-expanded={expandedRows.has(training._id)}
                                                >
                                                    {expandedRows.has(training._id) ? <ExpandLess /> : <ExpandMore />}
                                                </IconButton>
                                            ) : (
                                                <Typography variant="body2" color="textSecondary">
                                                    Batches not created
                                                </Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>

                                    {hasBatchDetails && (
                                        <TableRow>
                                            <TableCell colSpan={3} sx={{ padding: 0 }}>
                                                <Collapse in={expandedRows.has(training._id)} timeout="auto" unmountOnExit>
                                                    <Table sx={{ marginTop: 2, borderTop: '1px solid #ddd' }}>
                                                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                                            <TableRow>
                                                                <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Batch Number</TableCell>
                                                                <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Duration</TableCell>
                                                                <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Employee Count</TableCell>
                                                                <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Trainer</TableCell>
                                                                <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Actions</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {training.batchDetails?.map((batch) => (
                                                                <TableRow key={batch._id}>
                                                                    <TableCell sx={{ border: '1px solid #ddd' }}>{batch.batchNumber}</TableCell>
                                                                    <TableCell sx={{ border: '1px solid #ddd' }}>{batch.duration}</TableCell>
                                                                    <TableCell sx={{ border: '1px solid #ddd' }}>{batch.count}</TableCell>
                                                                    <TableCell sx={{ border: '1px solid #ddd' }}>
                                                                        {batch.trainerDetails ? batch.trainerDetails.name : 'Trainer not assigned'}
                                                                    </TableCell>
                                                                    <TableCell sx={{ border: '1px solid #ddd' }}>
                                                                        <Button
                                                                            variant="outlined"
                                                                            color="primary"
                                                                            onClick={() => handleShowEmployees(training._id, batch._id)}
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
