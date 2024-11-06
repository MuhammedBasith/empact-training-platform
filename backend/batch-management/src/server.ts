import app from './app';
import BatchRoutes from './routes/batchRoutes';
import 'dotenv/config';

const PORT = process.env.PORT || 3009;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
