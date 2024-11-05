import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { baselightTheme } from './theme/DefaultColors';
import { useUserContext } from './context/UserContext';

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
import NotFound from './components/Error';


import AdminDashboard from './components/Dashboard/AdminDashboard';
import ManagerDashboard from './components/Dashboard/ManagerDashboard';
import TrainerDashboard from './components/Dashboard/TrainerDashboard'

function App() {
  const { user } = useUserContext();
  const isAuthenticated = !!user;
  const role = user?.role?.toLowerCase();
  const location = useLocation();

  return (
    <RootLayout>
      <CssBaseline />
      <ThemeProvider theme={baselightTheme}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomeLayout><Home /></HomeLayout>} />

          {/* Redirect if authenticated */}
          <Route path="/signin" element={
            isAuthenticated ? (
              <Navigate to={`/dashboard/${role}`} replace state={{ from: location }} />
            ) : (
              <AuthLayout><SignIn /></AuthLayout>
            )
          } />

          <Route path="/signup" element={
            isAuthenticated ? (
              <Navigate to={`/dashboard/${role}`} replace state={{ from: location }} />
            ) : (
              <AuthLayout><SignUp /></AuthLayout>
            )
          } />

          <Route path="/reset-password" element={<AuthLayout><ResetPassword /></AuthLayout>} />

          {/* Protected Routes for Authenticated Users */}
          {isAuthenticated ? (
            <Route path="/dashboard" element={<DashboardLayout />}>
              {/* Role-Based Dashboard Routes */}
              {role === 'admin' && <Route path="admin" element={<AdminDashboard />} />}
              {role === 'manager' && <Route path="manager" element={<ManagerDashboard />} />}
              {role === 'trainer' && <Route path="trainer" element={<TrainerDashboard />} />}
              {/* Redirect to role-specific dashboard if accessing the dashboard route */}
              <Route path="*" element={<Navigate to={`/dashboard/${role}`} />} />
            </Route>
          ) : (
            // Redirect unauthenticated users to login
            <Route path="*" element={<Navigate to="/signin" replace />} />
          )}

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </RootLayout>
  );
}

export default App;
