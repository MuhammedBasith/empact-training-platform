import express  from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import 'dotenv/config'
import {config} from './config/db';
import TrainerManagementRoutes from './routes/trainer-management'
import cors from 'cors'
const app=express()

app.use(bodyParser.json())
app.use(cors())
const PORT=process.env.PORT || 3002;

mongoose.connect(config.mongoUri)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

app.use('/api/v1/trainer-management',TrainerManagementRoutes);
app.listen(PORT,()=>{
    console.log(`Server started on ${PORT}`)
})