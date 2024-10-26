import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('API Gateway'));

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});

