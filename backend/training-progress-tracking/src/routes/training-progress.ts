import {
    createTrainerFeedbackWithProgress,
    getAllTrainerFeedbackWithProgress,
    getTrainerFeedbackWithProgressBycognitoId,

    updateTrainerFeedbackWithProgress
} from "../controllers/training-progress";
import { Router } from "express";

const routes=Router();

routes.post('/',createTrainerFeedbackWithProgress);
routes.get('/',getAllTrainerFeedbackWithProgress);
routes.get('/:cognitoId', getTrainerFeedbackWithProgressBycognitoId);
routes.put('/:id', updateTrainerFeedbackWithProgress );

export default routes;