import {  createTrainingProgress, getAllTrainingProgress, getTrainingProgressById, updateTrainingProgress } from "controller/training-progress";
import { Router } from "express";

const routes=Router();

routes.post('/',createTrainingProgress);
routes.get('/',getAllTrainingProgress);
routes.get('/:id', getTrainingProgressById);
routes.put('/:id', updateTrainingProgress );

export default routes;