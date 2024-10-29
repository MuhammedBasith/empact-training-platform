import { assignTrainingToTrainer, createTrainer, deleteTrainer, getAllTrainers, getTrainerById, updateTrainer } from "../controllers/trainer-management";
import { Router } from "express";

const router=Router();

router.post('/trainer',createTrainer);
router.get('/trainer', getAllTrainers);
router.get('/trainer/:id',getTrainerById);
router.put('/trainer/:id', updateTrainer);
router.delete('/trainer/:id', deleteTrainer);
router.post('/trainer/:id', assignTrainingToTrainer);

export default router;