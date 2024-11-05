import { Grid, Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

// Renamed components specific to Admin Dashboard
import UserStatistics from '../../views/dashboard/components/UserStatistics';
import RevenueBreakdown from '../../views/dashboard/components/RevenueBreakdown';
import MonthlyExpenses from '../../views/dashboard/components/MonthlyExpenses';
import RecentActivities from '../../views/dashboard/components/RecentActivities';
import PerformanceOverview from '../../views/dashboard/components/PerformanceOverview';
import AdminNotifications from '../../views/dashboard/components/AdminNotifications';

const AdminDashboard = () => {
  return (
    <PageContainer title="Admin Dashboard" description="Admin-specific dashboard with user and financial insights">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <UserStatistics />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <RevenueBreakdown />
              </Grid>
              <Grid item xs={12}>
                <MonthlyExpenses />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4}>
            <RecentActivities />
          </Grid>
          <Grid item xs={12} lg={8}>
            <PerformanceOverview />
          </Grid>
          <Grid item xs={12}>
            <AdminNotifications />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default AdminDashboard;
