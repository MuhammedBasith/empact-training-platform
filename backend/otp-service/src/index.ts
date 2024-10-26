import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 3792;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Hello from otp-service'));

app.listen(PORT, () => {
  console.log(`otp-service running on port ${PORT}`);
});

