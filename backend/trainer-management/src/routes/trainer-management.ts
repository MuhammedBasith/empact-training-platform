import { assignTrainingToTrainer, createTrainer, deleteTrainer, getAllTrainers, getTrainerById, getTrainersForDropdown, getTrainingsAllocatedForATrainer, updateTrainer } from "../controllers/trainer-management";
import { Router } from "express";

const router=Router();

router.post('/trainer',createTrainer);
router.get('/trainers', getAllTrainers);
router.get('/trainers/:trainingId',getTrainerById);
router.put('/trainer/:cognitoId', updateTrainer);
router.delete('/trainer/:id', deleteTrainer);
router.post('/trainer/:id', assignTrainingToTrainer);
router.get('/getTrainersForDropdown',getTrainersForDropdown)
router.get('/getTrainingsAllocatedForATrainer/:cognitoId', getTrainingsAllocatedForATrainer);


export default router;