import { Grid, Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

// components
import EmployeeProgressOverview from './components/EmployeeProgressOverview';
import LearningImpactOverview from './components/LearningImpactOverview';
import ManagerInsights from './components/ManagerInsights';
import TrainingEngagementOverview from './components/TrainingEngagementOverview';

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="Managers Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <EmployeeProgressOverview />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <LearningImpactOverview />
              </Grid>
              <Grid item xs={12}>
                <TrainingEngagementOverview />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={16}>
            <ManagerInsights />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
