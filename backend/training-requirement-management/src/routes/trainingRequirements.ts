import express from 'express';
import { createTrainingRequirement, getTrainingRequirement, getAllTrainingRequirements, updateEmployeeCount, deleteTrainingRequirement, confirmRequirement, updateBatchIds, getTrainingRequirementsByManager, getTrainingRequirements, getEmpCountById } from '../controllers/trainingRequirementsController';
import { CreateTrainingRequirementDto, UpdateTrainingRequirementDto } from '../dtos/trainingRequirements.dto';

const router = express.Router();

router.post('/', createTrainingRequirement);
router.post('/:requirementId/confirm', confirmRequirement);
 router.get('/getTrainingRequirement/:cognitoId/:id', getTrainingRequirement);
// router.get('/', getAllTrainingRequirements);
router.put('/:id/empCount', updateEmployeeCount);
router.put('/:id/batchIds',updateBatchIds)
router.delete('/:id', deleteTrainingRequirement);
router.get('/getTrainingRequirementsByManager/:id',getTrainingRequirementsByManager);
router.get('/',getTrainingRequirements)   // cognitoId, name & count
router.get('/getEmpCountById/:id',getEmpCountById);


export default router;