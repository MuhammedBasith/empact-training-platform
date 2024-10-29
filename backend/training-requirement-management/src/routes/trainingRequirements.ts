import express from 'express';
import { createTrainingRequirement, getTrainingRequirement, getAllTrainingRequirements, updateTrainingRequirement, deleteTrainingRequirement, confirmRequirement } from '../controllers/trainingRequirementsController';
import { CreateTrainingRequirementDto, UpdateTrainingRequirementDto } from '../dtos/trainingRequirements.dto';

const router = express.Router();

router.post('/', createTrainingRequirement);
router.post('/:requirementId/confirm', confirmRequirement);
router.get('/:id', getTrainingRequirement);
router.get('/', getAllTrainingRequirements);
router.put('/:id', updateTrainingRequirement);
router.delete('/:id', deleteTrainingRequirement);



export default router;