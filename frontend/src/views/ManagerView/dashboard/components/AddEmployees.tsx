import React, { useState } from "react";
import axios from "axios";
import readXlsxFile from "read-excel-file";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Box, Typography, Paper } from "@mui/material";
import { MultiStepLoader as Loader } from "../../../../../src/components/ui/multi-step-loader"; 

interface Employee {
  name: string;
  email: string;
  account: string;
  skills: string;
  department: string;
}

const AddEmployeesPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState<{ text: string }[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files ? event.target.files[0] : null;
    if (uploadedFile) {
      const rows = await readXlsxFile(uploadedFile);
      const parsedEmployees: Employee[] = rows.slice(1).map(([name, email, account, skills, department]) => ({
        name: name as string,
        email: email as string,
        account: account as string,
        skills: skills as string,
        department: department as string,
      }));
      setEmployees(parsedEmployees);
      setFile(uploadedFile);
    }
  };

  const handleConfirmation = () => {
    setDialogOpen(false);
    processEmployees();
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  const processEmployees = async () => {
    setLoading(true);
    setProgress(0);
    let currentStep = 0;
    
    try {
      for (let i = 0; i < employees.length; i++) {
        const employee = employees[i];

        // Step 1: Creating Account in Cognito
        setLoadingStates([{ text: `Processing Employee ${employee.name}: Creating Account in Cognito` }]);
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

        if (cognitoResponse.status !== 200) {
          setError("Error creating Cognito account");
          break;
        }

        const cognitoId = cognitoResponse.data.cognitoId;

        // Step 2: Adding Employee to Employee Management System
        setLoadingStates([{ text: `Processing Employee ${employee.name}: Adding to Management System` }]);
        const employeeResponse = await axios.post(
          `${import.meta.env.VITE_APP_EMPLOYEE_MANAGEMENT_MICROSERVICE}/api/v1/employee-management`,
          {
            cognitoId,
            name: employee.name,
            email: employee.email,
            account: employee.account,
            skills: employee.skills,
            department: employee.department,
          }
        );

        if (employeeResponse.status !== 200) {
          setError("Error adding employee to management system");
          break;
        }

        // Update progress and dynamic loading states
        setProgress(((i + 1) / employees.length) * 100);
        setLoadingStates([
          { text: `Employee ${i + 1}, ${employee.name}, added successfully!` }
        ]);

        // Simulate some delay before moving to the next employee
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("An error occurred while processing employees.");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 900, margin: "20px auto", textAlign: "center" }}>
      {!file ? (
        <Box>
          <Typography variant="h6">Upload Employee Data</Typography>
          <Button
            variant="contained"
            component="label"
            sx={{ mt: 2 }}
          >
            Select File
            <input type="file" accept=".xlsx, .xls" hidden onChange={handleFileUpload} />
          </Button>
        </Box>
      ) : (
        <Box>
          <Typography variant="h6" sx={{ mt: 2 }}>
            {employees.length} employees found in the Excel sheet.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={() => setDialogOpen(true)}
          >
            Confirm and Add Employees
          </Button>
        </Box>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleCancel}>
        <DialogTitle>Confirm Employee Addition</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {employees.length} employees were found in the Excel sheet. Are you sure you want to add them?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmation} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading State */}
      {loading && <Loader loadingStates={loadingStates} loading={loading} duration={2000} />}

      {/* Error Handling */}
      {error && (
        <Box sx={{ mt: 3, color: "red" }}>
          <Typography variant="h6">{error}</Typography>
        </Box>
      )}

      {/* Progress Bar */}
      {loading && (
        <Box sx={{ mt: 3 }}>
          <CircularProgress variant="determinate" value={progress} />
        </Box>
      )}
    </Paper>
  );
};

export default AddEmployeesPage;
