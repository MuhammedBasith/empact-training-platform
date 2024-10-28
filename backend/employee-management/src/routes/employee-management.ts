import { Router } from "express";
import { createEmployee,getAllEmployees,getEmployeeByUserId } from "../controllers/employee-management";

const router=Router();

router.post('/employee',createEmployee);
router.get('/employee', getAllEmployees);
router.get('/employee/:userId',getEmployeeByUserId);

export default router;