import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { connectToDatabase } from '../../authentication/src/config/db.config';
import authRoutes from './routes/auth.routes';
import 'dotenv/config'


const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(helmet()); // For security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // For request logging in the console
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Health check route
app.get('/', (req: Request, res: Response) => {
  res.status(200).send('API is up and running!');
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'An unexpected error occurred' });
});

// Start server and connect to the database
const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
};

startServer();
