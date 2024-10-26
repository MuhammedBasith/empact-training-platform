import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 3152;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Hello from progress-service'));

app.listen(PORT, () => {
  console.log(`progress-service running on port ${PORT}`);
});

