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

const ManagerDetails = ({ cognitoId }) => {
    const [managerDetails, setManagerDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchManagerDetails = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_APP_TRAINING_REQUIREMENTS_MICROSERVICE_BACKEND}/api/v1/training-requirements/${cognitoId}`
                );
                setManagerDetails(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching manager details:", error);
                setLoading(false);
            }
        };

        fetchManagerDetails();
    }, [cognitoId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!managerDetails) {
        return (
            <Typography variant="h6" color="textSecondary">
                No details available.
            </Typography>
        );
    }

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Manager Details</Typography>
            <Typography variant="subtitle1">Name: {managerDetails.name}</Typography>
            <Typography variant="subtitle1">Email: {managerDetails.email}</Typography>
            <Typography variant="subtitle1">Total Trainings Created: {managerDetails.trainingsCount}</Typography>
        </Box>
    );
};

const ManagersData = () => {
    const [managers, setManagers] = useState([]); // Default to an empty array
    const [loading, setLoading] = useState(true);
    const [selectedManagerId, setSelectedManagerId] = useState(null);
    const history = useNavigate();

    useEffect(() => {
        const fetchManagersData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_APP_TRAINING_REQUIREMENTS_MICROSERVICE_BACKEND}/api/v1/training-requirements`
                );
                
                // Ensure that the response is an array
                if (Array.isArray(response.data)) {
                    setManagers(response.data);
                } else {
                    console.error("Expected an array but got:", response.data);
                    setManagers([]);
                }
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching managers data:", error);
                setManagers([]); // Set an empty array in case of error
                setLoading(false);
            }
        };

        fetchManagersData();
    }, []);

    const handleActionClick = (cognitoId) => {
        setSelectedManagerId(cognitoId); // Set the selected manager ID
    };

    if (loading) {
        return (
            <DashboardCard title="Managers Data">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <CircularProgress />
                </Box>
            </DashboardCard>
        );
    }

    // Show message if no managers are available
    if (managers.length === 0) {
        return (
            <DashboardCard title="Managers Data">
                <Box sx={{ textAlign: 'center', py: 5 }}>
                    <Typography variant="h6" color="textSecondary">
                        No managers available.
                    </Typography>
                </Box>
            </DashboardCard>
        );
    }

    return (
        <DashboardCard title="Managers Data">
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
                                    Manager's Name
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Trainings Created
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
                        {managers.map((manager, index) => (
                            <TableRow key={manager.cognitoId}>
                                <TableCell>
                                    <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
                                        {index + 1}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        {manager.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        {manager.trainingsCount}
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
                                        onClick={() => handleActionClick(manager.cognitoId)}
                                    >
                                        View Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>

            {/* Conditionally render the manager details component if a manager is selected */}
            {selectedManagerId && <ManagerDetails cognitoId={selectedManagerId} />}
        </DashboardCard>
    );
};

export default ManagersData;
