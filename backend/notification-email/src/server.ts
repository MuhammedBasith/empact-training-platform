import express from "express";
import mongoose from "mongoose";
import 'dotenv/config'
import {config} from './config/db'

const PORT=process.env.PORT || 6000;
const app=express();
app.use(express.json());
mongoose.connect(config.mongoUri)
   .then(()=>console.log("connected to db"))
   .catch((err)=>console.log(err))

app.listen(3000,()=>{
    console.log("server started on port 6000");
})
