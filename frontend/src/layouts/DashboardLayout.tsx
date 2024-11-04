// src/layouts/DashboardLayout.js
import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { baselightTheme } from '../theme/DefaultColors';

const DashboardLayout = ({ children }) => {
  return (
    <ThemeProvider theme={baselightTheme}>
      <CssBaseline />
      <div>{children}</div>
    </ThemeProvider>
  );
};

export default DashboardLayout;
