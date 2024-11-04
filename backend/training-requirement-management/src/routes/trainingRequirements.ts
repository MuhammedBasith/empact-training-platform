import express from 'express';
import { createTrainingRequirement, getTrainingRequirement, getAllTrainingRequirements, updateEmployeeCount, deleteTrainingRequirement, confirmRequirement, updateBatchIds, getTrainingRequirementsByManager, getTrainingRequirements } from '../controllers/trainingRequirementsController';
import { CreateTrainingRequirementDto, UpdateTrainingRequirementDto } from '../dtos/trainingRequirements.dto';

const router = express.Router();

router.post('/', createTrainingRequirement);
router.post('/:requirementId/confirm', confirmRequirement);
 router.get('/:cognitoId/:id', getTrainingRequirement);
// router.get('/', getAllTrainingRequirements);
router.put('/:id/empCount', updateEmployeeCount);
router.put('/:id/batchIds',updateBatchIds)
router.delete('/:id', deleteTrainingRequirement);
router.get('/:id',getTrainingRequirementsByManager);
router.get('/',getTrainingRequirements)


export default router;