import express  from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import 'dotenv/config'
import {config} from './config/db';
import TrainerManagementRoutes from './routes/trainer-management'
const app=express()

app.use(bodyParser.json())
const PORT=process.env.PORT || 3001;

mongoose.connect(config.mongoUri)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

app.use('/api/trainer-management',TrainerManagementRoutes);
app.listen(PORT,()=>{
    console.log(`Server started on ${PORT}`)
})