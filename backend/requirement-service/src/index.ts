import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 3533;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Hello from requirement-service'));

app.listen(PORT, () => {
  console.log(`requirement-service running on port ${PORT}`);
});

