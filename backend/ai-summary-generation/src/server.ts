import express from 'express';
import bodyParser from 'body-parser';
import middlewareCors from './middleware/cors';
import connectDB from './config/db';
import summaryRoutes from './routes/summaryRoutes';
import cors from 'cors' 
const app = express();
const PORT = process.env.PORT || 3004

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/v1/summaries', summaryRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
