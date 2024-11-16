import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    CircularProgress,
} from '@mui/material';
import DashboardCard from '../../../../components/shared/DashboardCard';
import { useUserContext } from "../../../../context/UserContext"; 

const TrainersEngagementData = () => {
    const [trainings, setTrainings] = useState<any[]>([]);  // Store the training data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>(''); // For error handling
    const navigate = useNavigate();
    const { user } = useUserContext();
    console.log(user?.cognitoID);
    

    useEffect(() => {
        // Fetch assigned trainings for the trainer
        const fetchAssignedTrainings = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_APP_TRAINER_MICROSERVICES_URL}/api/v1/trainer-management/getTrainingsAllocatedForATrainer/${user?.cognitoID}`
                );
                console.log(response.data);

                // Assuming response.data contains an array of training data
                if (response.data && response.data.trainings) {
                    setTrainings(response.data.trainings);
                } else {
                    setTrainings([]);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching trainings data:", error);
                setError('Failed to load trainings');
                setTrainings([]); // Set empty array if error occurs
                setLoading(false);
            }
        };

        fetchAssignedTrainings();
    }, [user?.cognitoID]);

    const handleViewDetailsClick = (trainingId: string) => {
        // Navigate to the details page of the selected training
        navigate(`/dashboard/trainer/trainings/${trainingId}`);
    };

    if (loading) {
        return (
            <DashboardCard title="Assigned Trainings">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <CircularProgress />
                </Box>
            </DashboardCard>
        );
    }

    // Show error message if there was an issue fetching the data
    if (error) {
        return (
            <DashboardCard title="Assigned Trainings">
                <Box sx={{ textAlign: 'center', py: 5 }}>
                    <Typography variant="h6" color="error">
                        {error}
                    </Typography>
                </Box>
            </DashboardCard>
        );
    }

    // Show message if no trainings are available
    if (trainings.length === 0) {
        return (
            <DashboardCard title="Assigned Trainings">
                <Box sx={{ textAlign: 'center', py: 5 }}>
                    <Typography variant="h6" color="textSecondary">
                        No trainings assigned yet.
                    </Typography>
                </Box>
            </DashboardCard>
        );
    }

    return (
        <DashboardCard title="Assigned Trainings">
            <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
                <Table aria-label="trainings table" sx={{ whiteSpace: "nowrap", mt: 2 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    # Index
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Training Name
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Skills to Train
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Duration
                                </Typography>
                            </TableCell>

                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Action
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {trainings.map((training, index) => (
                            <TableRow key={training._id}>
                                <TableCell>
                                    <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
                                        {index + 1}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        {training.trainingName}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        {Array.isArray(training.skills_to_train)
                                            ? training.skills_to_train.join(', ') 
                                            : training.skills_to_train}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        {training.duration} Weeks
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                            },
                                        }}
                                        onClick={() => handleViewDetailsClick(training._id)}
                                    >
                                        View Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </DashboardCard>
    );
};

export default TrainersEngagementData;
