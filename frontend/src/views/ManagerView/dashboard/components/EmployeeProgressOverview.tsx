import React from 'react';
import { Select, MenuItem } from '@mui/material';
import DashboardCard from '../../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';

const EmployeeProgressOverview = () => {
  // select
  const [month, setMonth] = React.useState('1');

  const handleChange = (event: any) => {
    setMonth(event.target.value);
  };

  const options = {
    chart: {
      type: 'bar',
      height: 370,
    },
    xaxis: {
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], // Simple categories
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
      },
    },
    dataLabels: {
      enabled: false, 
    },
    legend: {
      show: true,
    },
  };

  // Hardcoded data for the bar chart
  const series = [
    {
      name: 'Learnings',
      data: [500, 700, 600, 800],
    },
    {
      name: 'Expenses',
      data: [400, 350, 450, 500],
    },
  ];

  return (
    // @ts-ignore
    <DashboardCard
      title="Employee Progress Overview"
      action={
        <Select labelId="month-dd" id="month-dd" value={month} size="small" onChange={handleChange}>
          <MenuItem value={1}>March 2024</MenuItem>
          <MenuItem value={2}>April 2024</MenuItem>
          <MenuItem value={3}>May 2024</MenuItem>
        </Select>
      }
    >
      <Chart options={options} series={series} type="bar" height="370px" />
    </DashboardCard>
  );
};

export default EmployeeProgressOverview;
