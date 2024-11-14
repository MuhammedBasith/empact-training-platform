import { Router } from "express";
import { createEmployee, getAllEmployees,getEmployeeByCognitoId } from "../controllers/employee-management";

const router = Router();

// @ts-ignore
router.post('/',createEmployee);
router.get('/', getAllEmployees);
router.get('/:cognitoId',getEmployeeByCognitoId);

export default router;