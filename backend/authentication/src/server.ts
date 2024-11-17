import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { connectToDatabase } from '../../authentication/src/config/db.config';
import authRoutes from './routes/auth.routes';
import 'dotenv/config'
import ngrok from '@ngrok/ngrok'

const app = express();
const port = process.env.PORT || 3001;

app.use(cors()); // Enable CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);


// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'An unexpected error occurred' });
});


connectToDatabase();

app.listen(port, () => {
  console.log("Server is running on http://localhost:${port}");
});

ngrok.connect({ addr: port, authtoken_from_env: true })
	.then(listener => console.log(`Ingress established at: ${listener.url()}`));