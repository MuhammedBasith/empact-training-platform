// src/App.js
import React, { lazy, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { baselightTheme } from './theme/DefaultColors';

// Import layouts
import RootLayout from './layouts/RootLayout';
import AuthLayout from './layouts/AuthLayout';
import HomeLayout from './layouts/HomeLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Import pages
import SignIn from './components/Auth/signin/SignIn';
import SignUp from './components/Auth/signup/SignUp';
import ResetPassword from './components/Auth/reset-password/ResetPassword';
import Home from './components/Home';
import NotFound from './components/NotFound';

// Lazy load dashboard components for each role
const AdminDashboard = lazy(() => import('./components/Dashboard/AdminDashboard'));
const ManagerDashboard = lazy(() => import('./components/Dashboard/ManagerDashboard'));
const EmployeeDashboard = lazy(() => import('./components/Dashboard/EmployeeDashboard'));
const TrainerDashboard = lazy(() => import('./components/Dashboard/TrainerDashboard'));

// Mock user context
const user = {
  isAuthenticated: true,
  role: 'admin', // Change this to test different roles
};

function App() {
  return (
    <RootLayout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomeLayout><Home /></HomeLayout>} />
        <Route path="/signin" element={<AuthLayout><SignIn /></AuthLayout>} />
        <Route path="/signup" element={<AuthLayout><SignUp /></AuthLayout>} />
        <Route path="/reset-password" element={<AuthLayout><ResetPassword /></AuthLayout>} />

        {/* Protected Routes for Authenticated Users */}
        {user.isAuthenticated ? (
          <Route
            path="/dashboard/*"
            element={
              <ThemeProvider theme={baselightTheme}>
                <CssBaseline />
                <DashboardLayout>
                  <Routes>
                    {/* Role-Based Dashboard Routes */}
                    {user.role === 'admin' && (
                      <Route path="admin" element={<AdminDashboard />} />
                    )}
                    {user.role === 'manager' && (
                      <Route path="manager" element={<ManagerDashboard />} />
                    )}
                    {user.role === 'employee' && (
                      <Route path="employee" element={<EmployeeDashboard />} />
                    )}
                    {user.role === 'trainer' && (
                      <Route path="trainer" element={<TrainerDashboard />} />
                    )}
                    {/* Redirect to role-specific dashboard */}
                    <Route path="*" element={<Navigate to={`/dashboard/${user.role}`} />} />
                  </Routes>
                </DashboardLayout>
              </ThemeProvider>
            }
          />
        ) : (
          <Route path="*" element={<Navigate to="/signin" />} />
        )}

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </RootLayout>
  );
}

export default App;
