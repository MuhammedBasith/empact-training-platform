import { Request, Response } from "express";
import EmployeeManagement, { IEmployeeManagement } from "../models/employee-management";


export const createEmployee = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const { cognitoId, empName, empEmail, empAccount, empSkills, department } = data;


    // Check if the employee already exists in the database based on the cognitoId
    const existingEmployee = await EmployeeManagement.findOne({ cognitoId });

    if (existingEmployee) {

      // Respond with the updated employee data
      const updatedEmployee = await EmployeeManagement.findOne({ cognitoId });
      return res.status(200).json(updatedEmployee);
    }

    // If the employee does not exist, create a new employee entry
    const newEmployee = new EmployeeManagement({
      cognitoId,
      empName,
      empEmail,
      empAccount,
      empSkills,
      department,
    });

    // Save the new employee
    await newEmployee.save();

    // Respond with the created employee data
    return res.status(201).json(newEmployee);

  } catch (error) {
    console.error('Error creating employee:', error);
    return res.status(500).json({ message: 'Internal server error' });
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


export async function getEmployeeByCognitoId(
  request: Request<{ cognitoId: string }>,
  response: Response<IEmployeeManagement | { message: string; error?: string }>
): Promise<any> {
  const { cognitoId } = request.params; // Get userId from URL parameters
  try {
    const employee = await EmployeeManagement.findOne({ cognitoId }); // Find employee by userId
    if (!employee) {
      return response.status(404).json({ message: 'Employee not found' });
    }
    return response.status(200).json(employee); // Return the found employee
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: 'Error retrieving employee', error });
  }
}

