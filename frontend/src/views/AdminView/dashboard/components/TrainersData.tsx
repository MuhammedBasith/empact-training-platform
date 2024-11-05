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
    Chip,
    Card,
    CardContent,
} from '@mui/material';
import DashboardCard from '../../../../components/shared/DashboardCard';

const TrainersData = () => {
    const [trainers, setTrainers] = useState([]); // Default to an empty array
    const [loading, setLoading] = useState(true);
    const history = useNavigate();

    useEffect(() => {
        const fetchTrainersData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_APP_TRAINER_MICROSERVICES_URL}/api/v1/trainers`
                );
                console.log(response.data);

                setTrainers(response.data.trainers); // Assuming the response contains the 'trainers' field
                setLoading(false);
            } catch (error) {
                console.error("Error fetching trainers data:", error);
                setTrainers([]); // Set an empty array in case of error
                setLoading(false);
            }
        };

        fetchTrainersData();
    }, []);

    const handleActionClick = (cognitoId: any) => {
        // Navigate to the trainer details page with the cognitoId
        history(`/dashboard/admin/trainers/${cognitoId}`);
    };

    if (loading) {
        return (
            <DashboardCard title="Trainers Data">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <CircularProgress />
                </Box>
            </DashboardCard>
        );
    }

    // Show message if no trainers are available
    if (trainers.length === 0) {
        return (
            <DashboardCard title="Trainers Data">
                <Box sx={{ textAlign: 'center', py: 5 }}>
                    <Typography variant="h6" color="textSecondary">
                        No trainers available.
                    </Typography>
                </Box>
            </DashboardCard>
        );
    }

    return (
        <DashboardCard title="Trainers Data">
            <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
                <Table aria-label="simple table" sx={{ whiteSpace: "nowrap", mt: 2 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    ID
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Trainer's Name
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Expertise Areas
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
                        {trainers.map((trainer, index) => (
                            <TableRow key={trainer._id}>
                                <TableCell>
                                    <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
                                        {index + 1}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        {trainer.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    {/* Render expertise areas as chips */}
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {trainer.expertise.map((area, idx) => (
                                            <Chip key={idx} label={area} color="primary" size="small" />
                                        ))}
                                    </Box>
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
                                        onClick={() => handleActionClick(trainer._id)}
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

export default TrainersData;
