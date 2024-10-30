import express  from "express";
import NotificationRoute from "./routes/notification-training";
const app=express();

const PORT=process.env.PORT || 8000;
app.use(express.json());
app.use('/api/v1/notification-service',NotificationRoute);