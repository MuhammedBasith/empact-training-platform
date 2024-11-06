import express from 'express';
import { createTrainingRequirement, getTrainingRequirement, getAllTrainingRequirements, updateEmployeeCount, deleteTrainingRequirement, confirmRequirement, updateBatchIds, getTrainingRequirements, getEmpCountById, getTrainingRequirementUnderAManager, getTrainingRequirementsByManager, getTrainingDetailsByIds, getTrainingDetailsWithBatches } from '../controllers/trainingRequirementsController';
import { CreateTrainingRequirementDto, UpdateTrainingRequirementDto } from '../dtos/trainingRequirements.dto';
import trainingRequirementModel from 'models/trainingRequirement.model';

const router = express.Router();

router.post('/', createTrainingRequirement);
router.post('/confirmRequirement/:requirementId', confirmRequirement);
 router.get('/getTrainingRequirement/:cognitoId/:id', getTrainingRequirement);
// router.get('/', getAllTrainingRequirements);
router.put('/:id/empCount', updateEmployeeCount);
router.put('/updateBatchIds/:id/',updateBatchIds)
router.delete('/:id', deleteTrainingRequirement);
router.get('/getTrainingRequirementsByManager/:id',getTrainingRequirementsByManager);
router.get('/',getTrainingRequirements)   // cognitoId, name & count
router.get('/getEmpCountById/:id',getEmpCountById);  
router.get('/getTrainingRequirementUnderAManager/:id',getTrainingRequirementUnderAManager);
// @ts-ignore
router.post('/getTrainingDetailsByIds', getTrainingDetailsByIds);

// @ts-ignore
// Endpoint to get training details with batch and trainer information
router.get('/getTrainingDetails/:trainingId/:cognitoId', getTrainingDetailsWithBatches);


export default router;