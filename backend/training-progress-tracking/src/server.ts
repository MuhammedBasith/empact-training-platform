import  express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import { config } from "./config/db";
import TrainingProgressRoutes from "./routes/training-progress";
const app=express();
app.use(express.json());

const PORT=process.env.PORT || 3005;

mongoose.connect(config.mongoUri)
   .then(()=>{console.log("mongoDB Connected")})
   .catch((err)=>{console.log("Error connecting to mongoDB",err)})



   app.listen(PORT,()=>{
    console.log(`server started on ${PORT}`)
   })

   app.use('/api/v1/training-progress',TrainingProgressRoutes);