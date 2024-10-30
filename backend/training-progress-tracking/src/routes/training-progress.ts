import {
    createTrainerFeedbackWithProgress,
    getAllTrainerFeedbackWithProgress,
    getTrainerFeedbackWithProgressById,
    updateTrainerFeedbackWithProgress
} from "../controllers/training-progress";
import { Router } from "express";

const routes=Router();

routes.post('/',createTrainerFeedbackWithProgress);
routes.get('/',getAllTrainerFeedbackWithProgress);
routes.get('/:id', getTrainerFeedbackWithProgressById);
routes.put('/:id', updateTrainerFeedbackWithProgress );

export default routes;