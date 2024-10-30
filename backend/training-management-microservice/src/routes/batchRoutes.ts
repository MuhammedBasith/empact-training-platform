import express from 'express';
import { createBatch, getAllBatches, addFeedback } from '../controllers/batchController';

const router = express.Router();

// Create a new batch
router.post('/', createBatch);

// Get all batches
router.get('/', getAllBatches);

// Add feedback
router.post('/feedback', addFeedback);

export default router;
