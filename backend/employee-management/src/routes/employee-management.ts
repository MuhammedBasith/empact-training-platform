import { Router } from "express";
import { createEmployee,getAllEmployees,getEmployeeByCognitoId, updateEmployeeTrainingIds } from "../controllers/employee-management";

const router=Router();

router.post('/',createEmployee);
router.get('/', getAllEmployees);
router.get('/:cognitoId',getEmployeeByCognitoId);
router.put('/:cognitoId',updateEmployeeTrainingIds);
export default router;