import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow, Typography, Paper, Box, CircularProgress } from '@mui/material';
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
}

const EmployeeBatchUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [maxMarks, setMaxMarks] = useState<number | null>(null);
  const [batches, setBatches] = useState<number>(0);
  const [cutoffs, setCutoffs] = useState<Cutoff[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Handle file upload and parse Excel
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

  // Handle maximum marks input
  const handleMaxMarksInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxMarks(Number(event.target.value));
    setBatches(0);
    setCutoffs([]);
  };

  // Handle number of batches input and calculate cutoffs
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
        };
      });
      setCutoffs(newCutoffs);
    }
  };

  // Confirm creation of batches
  const handleCreateBatches = () => {
    setDialogOpen(true);
  };

  // Send data to backend
  const confirmAndSendData = async () => {
    setDialogOpen(false);
    const dataToSend = {
      batches: cutoffs.map((cutoff, index) => ({
        batchNumber: index + 1,
        range: cutoff.range,
        employees: employees.slice(index * cutoff.count, (index + 1) * cutoff.count),
      })),
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BATCH_MICROSERVICES_URL}/api/v1/create-batches`, dataToSend);
      console.log('Batch data sent successfully:', response.data);
      // Handle success notification or further actions
    } catch (error) {
      console.error('Error sending batch data:', error);
      // Handle error notification or retries
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
                </TableRow>
              </TableHead>
              <TableBody>
                {cutoffs.map((cutoff, index) => (
                  <TableRow key={index}>
                    <TableCell>Batch {index + 1}</TableCell>
                    <TableCell>{cutoff.range}</TableCell>
                    <TableCell>{cutoff.count}</TableCell>
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
            disabled={cutoffs.length === 0}
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

export default EmployeeBatchUploader;
