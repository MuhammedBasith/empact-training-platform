import express from 'express';
import { createTrainingRequirement, getTrainingRequirement, getAllTrainingRequirements, updateEmployeeCount, deleteTrainingRequirement, confirmRequirement, updateBatchIds, getTrainingRequirements, getEmpCountById, getTrainingRequirementUnderAManager, getTrainingRequirementsByManager, getTrainingDetailsByIds, getTrainingDetailsByTrainer } from '../controllers/trainingRequirementsController';
import { CreateTrainingRequirementDto, UpdateTrainingRequirementDto } from '../dtos/trainingRequirements.dto';
import trainingRequirementModel from 'models/trainingRequirement.model';

const router = express.Router();

// GET Routes (Fetch resources)
router.get('/', getTrainingRequirements); // Get all training requirements (cognitoId, name & count)
router.get('/getTrainingRequirement/:cognitoId/:id', getTrainingRequirement); // Get specific training requirement by cognitoId & id
router.get('/getEmpCountById/:id', getEmpCountById); // Get employee count by id
router.get('/getTrainingRequirementsByManager/:id', getTrainingRequirementsByManager); // Get training requirements by manager id
router.get('/getTrainingRequirementUnderAManager/:id', getTrainingRequirementUnderAManager); // Get training requirements under a manager by id
router.get('/getTrainingDetails/:trainingId/:cognitoId', getTrainingDetailsByTrainer); // Get training details with batches by trainingId & cognitoId
router.post('/getTrainingDetailsByIds', getTrainingDetailsByIds); // Get training details by multiple ids

// POST Routes (Create resources)
router.post('/', createTrainingRequirement); // Create a new training requirement

// PUT Routes (Update resources)
router.put('/confirmRequirement/:requirementId', confirmRequirement); // Confirm a training requirement by requirementId
router.put('/:id/empCount', updateEmployeeCount); // Update employee count by id
router.put('/updateBatchIds/:id', updateBatchIds); // Update batch IDs by id

// DELETE Routes (Remove resources)
router.delete('/:id', deleteTrainingRequirement); // Delete a training requirement by id



export default router;