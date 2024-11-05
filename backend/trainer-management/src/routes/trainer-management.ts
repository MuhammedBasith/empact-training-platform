import { assignTrainingToTrainer, createTrainer, deleteTrainer, getAllTrainers, getTrainerById, getTrainersForDropdown, updateTrainer } from "../controllers/trainer-management";
import { Router } from "express";

const router=Router();

router.post('/trainer',createTrainer);
router.get('/trainers', getAllTrainers);
router.get('/trainer/:trainingId',getTrainerById);
router.put('/trainer/:cognitoId', updateTrainer);
router.delete('/trainer/:id', deleteTrainer);
router.post('/trainer/:id', assignTrainingToTrainer);
router.get('/getTrainersForDropdown',getTrainersForDropdown)

export default router;