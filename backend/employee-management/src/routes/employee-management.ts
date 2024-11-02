import { Router } from "express";
import { createEmployee,findEmployeesByTrainingId,getAllEmployees,getEmployeeByCognitoId, updateEmployeeTrainingIds } from "../controllers/employee-management";

const router=Router();

router.post('/',createEmployee);
router.get('/', getAllEmployees);
router.get('/:cognitoId',getEmployeeByCognitoId);
router.put('/:cognitoId',updateEmployeeTrainingIds);
router.get('/emp/:trainingId',findEmployeesByTrainingId)
export default router;