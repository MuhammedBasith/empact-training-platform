import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Paper, CircularProgress, Table, TableHead, TableRow, TableCell, TableBody, TextField, Select, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { UploadFile, DownloadForOffline } from '@mui/icons-material';
import readXlsxFile from 'read-excel-file';
import axios from 'axios';
import * as XLSX from 'xlsx';

interface Employee {
  name: string;
  email: string;
  marks: number;
  account: string;
  skills: string;
  department: string;
  cognitoId?: string;
}

interface Cutoff {
  range: string;
  count: number;
  duration: number | null;
  cognitoId: string | null;
  employees: Employee[];
}

interface Trainer {
  _id: string;
  name: string;
  email: string;
  bio: string;
  expertise: string[];
  cognitoId: string;
}

const AddResultsPage: React.FC = () => {
  const { trainingId } = useParams<{ trainingId: string }>();
  const [file, setFile] = useState<File | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [maxMarks, setMaxMarks] = useState<number | null>(null);
  const [batches, setBatches] = useState<number>(0);
  const [cutoffs, setCutoffs] = useState<Cutoff[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
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

  // Handle file upload and parsing
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files ? event.target.files[0] : null;
    if (uploadedFile) {
      setLoading(true);
      const rows = await readXlsxFile(uploadedFile);
      const parsedEmployees: Employee[] = rows.slice(1).map(([name, email, account, skills, department, marks]) => ({
        name: name as string,
        email: email as string,
        account: account as string,
        skills: skills as string,
        department: department as string,
        marks: marks as number,
      }));
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
        const batchEmployees = employees.filter(employee => employee.marks <= upper && employee.marks > lower);
        return {
          range,
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

    // Step 1: Create employee accounts in Cognito
    const updatedEmployees = await Promise.all(employees.map(async (employee) => {
      try {
        const cognitoResponse = await axios.post(
          `${import.meta.env.VITE_APP_AUTHENTICATION_MICROSERVICE_BACKEND}/api/auth/create-account`,
          {
            name: employee.name,
            email: employee.email,
            account: employee.account,
            skills: employee.skills,
            department: employee.department,
          }
        );
        if (cognitoResponse.status === 200) {
          employee.cognitoId = cognitoResponse.data.cognitoId;
        }
        return employee;
      } catch (err) {
        console.error(`Error creating account for ${employee.name}:`, err);
        return null;
      }
    }));

    // Step 2: Create batches based on employees and marks
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

    // Step 3: Send batch data to the batch management service
    try {
      const batchManagementResponse = await axios.post(
        `${import.meta.env.VITE_APP_BATCH_MANAGEMENT_MICROSERVICE}/api/v1/batch-management`,
        dataToSend
      );
      const batchIds = batchManagementResponse.data.data.map((batch: { _id: string }) => batch._id);

      // Step 4: Update the training requirement with batch IDs
      const updateData = { batchIds };
      await axios.put(
        `${import.meta.env.VITE_APP_TRAINING_REQUIREMENTS_MICROSERVICE_BACKEND}/api/v1/training-requirements/updateBatchIds/${trainingId}`,
        updateData
      );
      navigate(`/dashboard/admin/managers/`);
    } catch (error) {
      console.error('Error sending batch data or updating training requirement:', error);
    }
  };

  // Generate Excel template for download
  const generateExcelTemplate = () => {
    const templateData = [
      ['Name', 'Email', 'Account', 'Skills', 'Department', 'Marks'],  // Headers
      ['', '', '', '', '', ''], // Empty row to populate
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employee Data');
    
    // Generate file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(file);
    
    // Create download link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_template.xlsx';
    a.click();
    URL.revokeObjectURL(url);
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
          <Box sx={{ mt: 3 }}>
            <Typography variant="body1">Or download a template to fill in the employee data:</Typography>
            <Button
              variant="outlined"
              startIcon={<DownloadForOffline />}
              onClick={generateExcelTemplate}
              sx={{ mt: 2 }}
            >
              Download Template
            </Button>
          </Box>
        </Box>
      ) : loading ? (
        <CircularProgress />
      ) : (
        <Box>
          <TextField
            type="text"
            label="Max Marks"
            variant="outlined"
            value={maxMarks || ''}
            onChange={handleMaxMarksInput}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            type="number"
            label="Number of Batches"
            variant="outlined"
            value={batches}
            onChange={handleBatchInput}
            fullWidth
            sx={{ mt: 2, mb: 3 }}
          />
          {cutoffs.length > 0 && (
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Range</TableCell>
                  <TableCell>Count</TableCell>
                  <TableCell>Duration (hours)</TableCell>
                  <TableCell>Trainer</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cutoffs.map((cutoff, index) => (
                  <TableRow key={index}>
                    <TableCell>{cutoff.range}</TableCell>
                    <TableCell>{cutoff.count}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        label="Duration"
                        variant="outlined"
                        value={cutoff.duration ?? ''}
                        onChange={(e) => handleDurationInput(index, Number(e.target.value))}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={cutoff.cognitoId || ''}
                        onChange={(e) => handleTrainerSelection(index, e.target.value)}
                        fullWidth
                      >
                        {trainers.map((trainer) => (
                          <MenuItem key={trainer._id} value={trainer.cognitoId}>
                            {trainer.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <Button
            onClick={handleCreateBatches}
            variant="contained"
            disabled={!allDurationsAndTrainersFilled}
            sx={{ mt: 3 }}
          >
            Create Batches
          </Button>
        </Box>
      )}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Batches Creation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to proceed with creating batches and assigning trainers and durations?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
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
