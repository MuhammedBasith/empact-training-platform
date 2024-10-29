import express from "express";
import BaselineAssessmentRoutes from "./routes/baseline-assessment";
import 'dotenv/config';
import {config} from "./config/db";
import mongoose from "mongoose";
const app=express();
const PORT=process.env.PORT || 7000;
mongoose.connect(config.mongoUri)
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log("Error connecting to MongoDB",err);
})

app.use("/api/baseline-assessment",BaselineAssessmentRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})