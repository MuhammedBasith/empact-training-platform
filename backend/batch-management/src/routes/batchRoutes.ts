import express from 'express';
import { createBatch, updateTrainerId, getBatchById, getBatchesByTrainingId } from '../controllers/batchController';

const router = express.Router();

// Create a new batch
// @ts-ignore
router.post('/', createBatch);

router.put('/:id',updateTrainerId);

router.get('/:id',getBatchById);

// @ts-ignore
router.get('/getBatchesByTrainingId/:trainingId', getBatchesByTrainingId);

export default router;
