import { Grid, Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

// components
import TrainingProgressOverview from './components/TrainingProgressOverview';   
import AnnualLearningImpact from './components/AnnualLearningImpact';          
import TrainersEngagementData from './components/TrainersEngagementData';
import MonthlyTrainingEngagement from './components/MonthlyTrainingEngagement'; 

const Dashboard = () => {
  return (
    <PageContainer title="Trainer Dashboard" description="Overview of your training impact and performance">
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
            <TrainersEngagementData />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
