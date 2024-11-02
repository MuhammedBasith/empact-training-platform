import express from 'express';
import { createBatch, getAllBatches, addFeedback, updateTrainerId } from '../controllers/batchController';

const router = express.Router();

// Create a new batch
router.post('/', createBatch);

// Get all batches
router.get('/', getAllBatches);

// Add feedback
router.post('/feedback', addFeedback);

router.put('/:id/trainerId',updateTrainerId);

export default router;
