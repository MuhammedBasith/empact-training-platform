import { Router } from 'express';
import {
  generateSummary,
  getSummary,
  editSummary,
  confirmSummary,
  generateFeedbackSummary,
} from '../controllers/summaryController';

const router = Router();


router.post('/generate', generateSummary);
router.post('/feedbackSummary', generateFeedbackSummary);
router.get('/:traningRequirementId', getSummary);
router.put('/:requirementId/edit', editSummary);
router.post('/:requirementId/confirm', confirmSummary);

export default router;
