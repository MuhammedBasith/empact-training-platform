import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom'; // Import useParams
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow, Typography, Paper, Box, CircularProgress, MenuItem, Select } from '@mui/material';
import { UploadFile } from '@mui/icons-material';
import readXlsxFile from 'read-excel-file';
import axios from 'axios';

interface Employee {
  name: string;
  email: string;
  marks: number;
}

interface Cutoff {
  range: string;
  count: number;
  duration: number | null;
  trainerId: string | null;
}

interface Trainer {
  id: string;
  name: string;
  expertise: string; // Add expertise property
}

const AddResultsPage: React.FC = () => {
  const { trainingId } = useParams<{ trainingId: string }>(); // Extract trainingId from the URL
  const [file, setFile] = useState<File | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [maxMarks, setMaxMarks] = useState<number | null>(null);
  const [batches, setBatches] = useState<number>(0);
  const [cutoffs, setCutoffs] = useState<Cutoff[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Ensure that trainingId exists, if not, navigate to 404 or another fallback route
  if (!trainingId) {
    return <Navigate to="/404" />;
  }

  useEffect(() => {
    // Fetch trainers from the backend
    const fetchTrainers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_TRAINER_MICROSERVICES_URL}/api/v1/trainers`);
        setTrainers(response.data); // Assuming response contains id, name, and expertise
      } catch (error) {
        console.error('Error fetching trainers:', error);
      }
    };
    fetchTrainers();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files ? event.target.files[0] : null;
    if (uploadedFile) {
      setLoading(true);
      const rows = await readXlsxFile(uploadedFile);
      const parsedEmployees: Employee[] = rows.slice(1).map(([name, email, marks]) => ({
        name: name as string,
        email: email as string,
        marks: marks as number,
      }));
      parsedEmployees.sort((a, b) => b.marks - a.marks);
      setEmployees(parsedEmployees);
      setFile(uploadedFile);
      setLoading(false);
    }
  };

  const handleMaxMarksInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxMarks(Number(event.target.value));
    setBatches(0);
    setCutoffs([]);
  };

  const handleBatchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const batchCount = parseInt(event.target.value, 10);
    if (batchCount > 0 && maxMarks) {
      setBatches(batchCount);
      const newCutoffs = Array.from({ length: batchCount }, (_, i) => {
        const upper = maxMarks - (i * (maxMarks / batchCount));
        const lower = upper - (maxMarks / batchCount);
        return {
          range: `${Math.ceil(upper)} - ${Math.ceil(lower > 0 ? lower : 0)}`,
          count: Math.ceil(employees.length / batchCount),
          duration: null,
          trainerId: null,
        };
      });
      setCutoffs(newCutoffs);
    }
  };

  const handleDurationInput = (index: number, value: number) => {
    const updatedCutoffs = [...cutoffs];
    updatedCutoffs[index].duration = value;
    setCutoffs(updatedCutoffs);
  };

  const handleTrainerSelection = (index: number, trainerId: string) => {
    const updatedCutoffs = [...cutoffs];
    updatedCutoffs[index].trainerId = trainerId;
    setCutoffs(updatedCutoffs);
  };

  const allDurationsAndTrainersFilled = cutoffs.every((cutoff) => cutoff.duration !== null && cutoff.trainerId !== null);

  const handleCreateBatches = () => {
    setDialogOpen(true);
  };

  const confirmAndSendData = async () => {
    setDialogOpen(false);
    const dataToSend = {
      trainingRequirementId: trainingId, // Use the trainingId from the URL
      batches: cutoffs.map((cutoff, index) => ({
        batchNumber: index + 1,
        range: cutoff.range,
        duration: cutoff.duration,
        trainerId: cutoff.trainerId,
        employees: employees.slice(index * cutoff.count, (index + 1) * cutoff.count),
      })),
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BATCH_MANAGEMENT_MICROSERVICE}/api/v1/batch-management`, dataToSend);
      console.log('Batch data sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending batch data:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, margin: '20px auto', textAlign: 'center' }}>
      {!file ? (
        <Box>
          <Typography variant="h6">Upload Employee Data</Typography>
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadFile />}
            sx={{ mt: 2 }}
          >
            Select File
            <input type="file" accept=".xlsx, .xls" hidden onChange={handleFileUpload} />
          </Button>
        </Box>
      ) : loading ? (
        <CircularProgress />
      ) : (
        <Box>
          <TextField
            type="number"
            label="Maximum Marks"
            variant="outlined"
            value={maxMarks ?? ''}
            onChange={handleMaxMarksInput}
            placeholder="Enter maximum marks"
            fullWidth
            sx={{ mt: 2, mb: 3 }}
          />
          <TextField
            type="number"
            label="Number of Batches"
            variant="outlined"
            value={batches}
            onChange={handleBatchInput}
            placeholder="Enter number of batches"
            disabled={!maxMarks}
            fullWidth
            sx={{ mb: 3 }}
          />
          {cutoffs.length > 0 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Batch Number</TableCell>
                  <TableCell>Score Range</TableCell>
                  <TableCell>Employees in Batch</TableCell>
                  <TableCell>Duration (Weeks)</TableCell>
                  <TableCell>Trainer</TableCell>
                  <TableCell>Trainer Expertise</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cutoffs.map((cutoff, index) => (
                  <TableRow key={index}>
                    <TableCell>Batch {index + 1}</TableCell>
                    <TableCell>{cutoff.range}</TableCell>
                    <TableCell>{cutoff.count}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={cutoff.duration ?? ''}
                        onChange={(e) => handleDurationInput(index, parseInt(e.target.value, 10))}
                        placeholder="Duration"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={cutoff.trainerId ?? ''}
                        onChange={(e) => handleTrainerSelection(index, e.target.value as string)}
                        displayEmpty
                        fullWidth
                      >
                        <MenuItem value="" disabled>Select Trainer</MenuItem>
                        {trainers.map((trainer) => (
                          <MenuItem key={trainer.id} value={trainer.id}>{trainer.name}</MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      {/* Display the selected trainer's expertise */}
                      {cutoff.trainerId ? 
                        trainers.find(trainer => trainer.id === cutoff.trainerId)?.expertise || 'N/A' 
                        : 'Select Trainer'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={handleCreateBatches}
            disabled={cutoffs.length === 0 || !allDurationsAndTrainersFilled}
          >
            Create Batches
          </Button>
        </Box>
      )}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Batch Creation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to create {batches} batches with the current distribution?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmAndSendData} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default AddResultsPage;
