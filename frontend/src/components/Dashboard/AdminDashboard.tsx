import React from 'react';
import { Grid, Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

// components
import SalesOverview from '../../views/dashboard/components/SalesOverview';
import YearlyBreakup from '../../views/dashboard/components//YearlyBreakup';
import RecentTransactions from '../../views/dashboard/components//RecentTransactions';
import ProductPerformance from '../../views/dashboard/components/ProductPerformance';
import Blog from '../../views/dashboard/components/Blog';
import MonthlyEarnings from '../../views/dashboard/components/MonthlyEarnings';


const AdminDashboard = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <SalesOverview />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <YearlyBreakup />
              </Grid>
              <Grid item xs={12}>
                <MonthlyEarnings />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4}>
            <RecentTransactions />
          </Grid>
          <Grid item xs={12} lg={8}>
            <ProductPerformance />
          </Grid>
          <Grid item xs={12}>
            <Blog />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default AdminDashboard;
