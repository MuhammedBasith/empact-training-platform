import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import { config } from "./config/db";
import TrainingProgressRoutes from "./routes/training-progress";
import cors from "cors";


const PORT = process.env.PORT || 3005;

const app = express();

app.use(express.json());
app.use(cors());


mongoose.connect(config.mongoUri)
   .then(() => { console.log("mongoDB Connected") })
   .catch((err) => { console.log("Error connecting to mongoDB", err) })

app.listen(PORT, () => {
   console.log(`server started on ${PORT}`)
})

app.use('/api/v1/training-progress', TrainingProgressRoutes);