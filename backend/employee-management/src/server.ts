import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import 'dotenv/config'
import {config} from './config/db';
import EmployeeManagementRoutes from './routes/employee-management';
import cors from 'cors';
const app = express();

const PORT=process.env.PORT || 3006;

app.use(cors());
app.use(bodyParser.json());
mongoose.connect(config.mongoUri)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.use('/api/v1/employee-management',EmployeeManagementRoutes);