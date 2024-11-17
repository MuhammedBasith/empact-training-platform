// YOUR_BASE_DIRECTORY/netlify/functions/api.ts

import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { connectToDatabase } from '../../authentication/src/config/db.config';
import authRoutes from './routes/auth.routes';
import 'dotenv/config';
import serverless from 'serverless-http';

const app = express();

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

// Connect to the database after the app has started
connectToDatabase()
  .then(() => {
    console.log('Database connected successfully!');
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error)
  });

// Export the handler for Netlify
export const handler = serverless(app);
