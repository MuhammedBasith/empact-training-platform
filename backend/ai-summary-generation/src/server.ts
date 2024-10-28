import express from 'express';
import bodyParser from 'body-parser';
import cors from './middleware/cors';
import connectDB from './config/db';
import summaryRoutes from './routes/summaryRoutes';

const app = express();
const PORT = process.env.PORT

// Middleware
app.use(cors);
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/summaries', summaryRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
