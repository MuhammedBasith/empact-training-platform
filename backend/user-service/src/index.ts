import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 3731;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Hello from user-service'));

app.listen(PORT, () => {
  console.log(`user-service running on port ${PORT}`);
});

