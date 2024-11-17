import express from 'express';
import cors from 'cors';
import connectDB from './config/database';
import BatchRoutes from './routes/batchRoutes';
import errorHandler from './middlewares/errorHandler';
import 'dotenv/config';


const PORT = process.env.PORT || 3009;

const app = express();

app.use(cors());
app.use(express.json());

connectDB();
app.use('/api/v1/batch-management', BatchRoutes)


app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
