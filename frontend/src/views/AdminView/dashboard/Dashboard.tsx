import { Grid, Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

// components
import TrainingProgressOverview from './components/UserStatistics';
import AnnualLearningImpact from './components/AnnualLearningImpact';
import ManagersData from './components/ManagersData';
import MonthlyTrainingEngagement from './components/MonthlyTrainingEngagement';


const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <TrainingProgressOverview />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <AnnualLearningImpact />
              </Grid>
              <Grid item xs={12}>
                <MonthlyTrainingEngagement />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={16}>
            <ManagersData />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
