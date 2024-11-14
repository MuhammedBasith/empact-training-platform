import {  createTrainer, deleteTrainer, getAllTrainers, getTrainerById, getTrainersForDropdown, getTrainingsAllocatedForATrainer, updateTrainer, getTrainerByCognitoId } from "../controllers/trainer-management";
import { Router } from "express";

const router=Router();

router.post('/trainer',createTrainer);
router.get('/trainers', getAllTrainers);
router.get('/trainers/:trainingId', getTrainerById);
router.get('/trainers/getTrainerByCognitoId/:cognitoId', getTrainerByCognitoId);
router.put('/trainer/:cognitoId', updateTrainer); // for assignTrainingToTrainer
router.delete('/trainer/:id', deleteTrainer);
router.get('/getTrainersForDropdown', getTrainersForDropdown)
router.get('/getTrainingsAllocatedForATrainer/:cognitoId', getTrainingsAllocatedForATrainer);


export default router;