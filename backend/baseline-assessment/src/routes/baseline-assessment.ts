import { getAssessmentResults, sendBaselineAssessments, updateAssessment } from "../controller/baseline-assessment";
import { Router } from "express";
const routes=Router();

routes.post('/:trainingId',sendBaselineAssessments);
routes.get('/:trainingId',getAssessmentResults);
routes.put('/;trainingId',updateAssessment)
export default routes;