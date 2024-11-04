// src/App.js
import React, { lazy } from 'react';
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

function App() {
  const isAuthenticated = !!sessionStorage.getItem('idToken'); // Assuming user data is stored in session storage
  const role = sessionStorage.getItem('customRole'); // Retrieve role from session storage

  return (
    <RootLayout>
      <CssBaseline />
      <ThemeProvider theme={baselightTheme}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomeLayout><Home /></HomeLayout>} />
          <Route path="/signin" element={<AuthLayout><SignIn /></AuthLayout>} />
          <Route path="/signup" element={<AuthLayout><SignUp /></AuthLayout>} />
          <Route path="/reset-password" element={<AuthLayout><ResetPassword /></AuthLayout>} />

          {/* Protected Routes for Authenticated Users */}
          {isAuthenticated ? (
            <Route path="/dashboard/*" element={<DashboardLayout />}>
              <Routes>
                {/* Role-Based Dashboard Routes */}
                {role === 'admin' && <Route path="admin" element={<AdminDashboard />} />}
                {role === 'manager' && <Route path="manager" element={<ManagerDashboard />} />}
                {role === 'employee' && <Route path="employee" element={<EmployeeDashboard />} />}
                {role === 'trainer' && <Route path="trainer" element={<TrainerDashboard />} />}
                {/* Redirect to role-specific dashboard */}
                <Route path="*" element={<Navigate to={`/dashboard/${role}`} />} />
              </Routes>
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/signin" />} />
          )}

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </RootLayout>
  );
}

export default App;
