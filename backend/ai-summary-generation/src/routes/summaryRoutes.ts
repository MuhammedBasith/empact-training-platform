import { Router } from 'express';
import {
  generateSummary,
  getSummary,
  editSummary,
  confirmSummary,
} from '../controllers/summaryController';

const router = Router();

router.post('/generate', generateSummary);
router.get('/:requirementId', getSummary);
router.put('/:requirementId/edit', editSummary);
router.post('/:requirementId/confirm', confirmSummary);

export default router;
