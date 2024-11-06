import express from 'express';
import { createBatch, updateTrainerId, getBatchById } from '../controllers/batchController';

const router = express.Router();

// Create a new batch
// @ts-ignore
router.post('/', createBatch);

router.put('/:id/',updateTrainerId);

router.get('/:id',getBatchById);

export default router;
