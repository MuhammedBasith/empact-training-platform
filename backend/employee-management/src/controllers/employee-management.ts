import { Request,Response } from "express";
import EmployeeManagement ,{IEmployeeManagement}  from "../models/employee-management"; 

export const createEmployee = async (req: Request, res: Response) => {
    try {
      const data: Omit<IEmployeeManagement, '_id'| 'userId'> = req.body; // Assuming req.body contains the employee data
      const employee = new EmployeeManagement(data);
      await employee.save();
      res.status(201).json(employee); // Respond with the created employee
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  export const getAllEmployees = async (req: Request, res: Response) => {
    try {
      const employees = await EmployeeManagement.find(); // Fetch all employees
      res.status(200).json(employees); // Return the list of employees
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  export async function getEmployeeByUserId(
    request: Request<{ userId: string }>,
    response: Response<IEmployeeManagement | { message: string; error?: string }>
): Promise<any> {
    const { userId } = request.params; // Get userId from URL parameters
    try {
        const employee = await EmployeeManagement.findOne({ userId }); // Find employee by userId
        if (!employee) {
            return response.status(404).json({ message: 'Employee not found' });
        }
        return response.status(200).json(employee); // Return the found employee
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Error retrieving employee', error });
    }
}