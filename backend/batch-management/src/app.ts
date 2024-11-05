import express from 'express';
import cors from 'cors';
import connectDB from './config/database';
import batchRoutes from './routes/batchRoutes';
import errorHandler from './middlewares/errorHandler';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/v1/batches', batchRoutes);

app.use(errorHandler);

export default app;
