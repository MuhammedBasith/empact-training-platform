import { Grid, Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

// Renamed components specific to Admin Dashboard
import UserStatistics from '../../views/AdminView/dashboard/components/UserStatistics';
import RevenueBreakdown from '../../views/AdminView/dashboard/components/RevenueBreakdown';
import MonthlyExpenses from '../../views/AdminView/dashboard/components/MonthlyExpenses';
import RecentActivities from '../../views/AdminView/dashboard/components/RecentActivities';
import PerformanceOverview from '../../views/AdminView/dashboard/components/PerformanceOverview';
import AdminNotifications from '../../views/AdminView/dashboard/components/AdminNotifications';

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
