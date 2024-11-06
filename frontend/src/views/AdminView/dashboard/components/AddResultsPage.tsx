import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow, Typography, Paper, Box, CircularProgress, MenuItem, Select } from '@mui/material';
import { UploadFile } from '@mui/icons-material';
import readXlsxFile from 'read-excel-file';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Employee {
  name: string;
  email: string;
  marks: number;
}

interface Cutoff {
  range: string;
  count: number;
  duration: number | null;
  cognitoId: string | null;
  employees: Employee[]; // Employees in the batch
}

interface Trainer {
  _id: string;
  name: string;
  email: string;
  bio: string;
  expertise: string[]; // List of expertise areas
  cognitoId: string; // Unique identifier
}

const AddResultsPage: React.FC = () => {
  const { trainingId, id } = useParams<{ trainingId: string, id: string }>(); // Extract trainingId from the URL
  const [file, setFile] = useState<File | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [maxMarks, setMaxMarks] = useState<number | null>(null);
  const [batches, setBatches] = useState<number>(0);
  const [cutoffs, setCutoffs] = useState<Cutoff[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate()

  // Ensure that trainingId exists, if not, navigate to 404 or another fallback route
  if (!trainingId) {
    return <Navigate to="/404" />;
  }

  useEffect(() => {
    // Fetch trainers from the backend
    const fetchTrainers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_TRAINER_MICROSERVICES_URL}/api/v1/trainer-management/trainers`);
        setTrainers(response.data);
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
        const range = `${Math.ceil(upper)} - ${Math.ceil(lower > 0 ? lower : 0)}`;

        const batchEmployees = employees.filter((employee) => {
          return employee.marks <= upper && employee.marks > lower;
        });

        return {
          range: range,
          count: batchEmployees.length,
          duration: null,
          cognitoId: null,
          employees: batchEmployees,
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
    updatedCutoffs[index].cognitoId = trainerId;
    setCutoffs(updatedCutoffs);
  };

  const allDurationsAndTrainersFilled = cutoffs.every((cutoff) => cutoff.duration !== null && cutoff.cognitoId !== null);

  const handleCreateBatches = () => {
    setDialogOpen(true);
  };

  const confirmAndSendData = async () => {
    setDialogOpen(false);
    const dataToSend = {
      trainingRequirementId: trainingId,
      batches: cutoffs.map((cutoff, index) => ({
        batchNumber: index + 1,
        range: cutoff.range,
        duration: cutoff.duration,
        cognitoId: cutoff.cognitoId,
        employees: employees.slice(index * cutoff.count, (index + 1) * cutoff.count),
      })),
    };
    console.log(dataToSend);

    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BATCH_MANAGEMENT_MICROSERVICE}/api/v1/batch-management`, dataToSend);
      console.log('Batch data sent successfully:', response.data);
      navigate(`/dashboard/admin/managers/`);
    } catch (error) {
      console.error('Error sending batch data:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 900, margin: '20px auto', textAlign: 'center' }}>
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
            type="text"
            label="Maximum Marks"
            variant="outlined"
            value={maxMarks ?? ''}
            onChange={handleMaxMarksInput}
            placeholder="Enter maximum marks"
            fullWidth
            sx={{ mt: 2, mb: 3 }}
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
            }}
          />
          <TextField
            type="text"
            label="Number of Batches"
            variant="outlined"
            value={batches}
            onChange={handleBatchInput}
            placeholder="Enter number of batches"
            disabled={!maxMarks}
            fullWidth
            sx={{ mb: 3 }}
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
            }}
          />
          {cutoffs.length > 0 && (
            <Table sx={{ mt: 3, minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Batch Number</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Score Range</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Employees in Batch</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Duration (Weeks)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Trainer</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Trainer Expertise</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cutoffs.map((cutoff, index) => (
                  <TableRow key={index} sx={{ height: '60px' }}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{cutoff.range}</TableCell>
                    <TableCell>{cutoff.count}</TableCell>
                    <TableCell>
                      <TextField
                        type="text"
                        value={cutoff.duration ?? ''}
                        onChange={(e) => handleDurationInput(index, parseInt(e.target.value, 10))}
                        placeholder="Duration"
                        fullWidth
                        inputProps={{
                          inputMode: 'numeric',
                          pattern: '[0-9]*',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={cutoff.cognitoId ?? ''}
                        onChange={(e) => handleTrainerSelection(index, e.target.value as string)}
                        displayEmpty
                        fullWidth
                      >
                        <MenuItem value="" disabled>Select Trainer</MenuItem>
                        {trainers.map((trainer) => (
                          <MenuItem key={trainer.cognitoId} value={trainer.cognitoId}>{trainer.name}</MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      {cutoff.cognitoId ? 
                        trainers.find(trainer => trainer.cognitoId === cutoff.cognitoId)?.expertise.join(', ') || 'N/A' 
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
