import express from 'express';
import mongoose from 'mongoose';
import trainingRequirementsRouter from './routes/trainingRequirements';
import bodyParser from 'body-parser';
import 'dotenv/config';
import { config } from './config/db';
import cors from 'cors'



const app = express();
app.use(cors());
const PORT = process.env.PORT || 3003;

app.use(bodyParser.json());

mongoose.connect(config.mongoUri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/v1/training-requirements', trainingRequirementsRouter);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
