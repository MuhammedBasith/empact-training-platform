import { Request, Response } from "express";
import EmployeeManagement, { IEmployeeManagement } from "../models/employee-management";
import mongoose from "mongoose";



export const createEmployee = async (req: Request, res: Response) => {
  try {
    // Extract the data from the request body
    const data = req.body;
    const { cognitoId, empName, empEmail, empAccount, empSkills, department, trainingId } = data;

    // Convert the single trainingId to ObjectId
    const trainingObjectId = new mongoose.Types.ObjectId(trainingId);

    // Check if the employee already exists in the database based on the cognitoId
    const existingEmployee = await EmployeeManagement.findOne({ cognitoId });

    if (existingEmployee) {
      // If the employee exists, update their trainingIds array using $addToSet to ensure uniqueness
      await EmployeeManagement.updateOne(
        { cognitoId },
        { 
          $addToSet: { trainingIds: trainingObjectId }, // Only add one trainingId (single reference)
        }
      );

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
      trainingIds: [trainingObjectId], // Store the single trainingId in an array
      hiredAt: new Date(), // Add the hiredAt date if required
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

export async function updateEmployeeTrainingIds(
  request: Request<{ cognitoId: string }, {}, { trainingIds: string }>,
  response: Response
): Promise<any> {
  const { trainingIds } = request.body; // Extract the training ID from the request body

  try {
    // Ensure that the trainingId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(trainingIds)) {
      return response.status(400).json({ message: 'Invalid training ID format' });
    }

    // Find the employee by cognitoId and push the new training ID to the trainingIds array
    const updatedEmployee = await EmployeeManagement.findOneAndUpdate(
      { cognitoId: request.params.cognitoId }, // Use cognitoId to find the employee
      { trainingIds: trainingIds }, // Use $addToSet to avoid duplicates
      { new: true, useFindAndModify: false } // Return the updated document
    );

    if (!updatedEmployee) {
      return response.status(404).json({ message: 'Employee not found' });
    }

    response.status(200).json(updatedEmployee);
  } catch (error) {
    console.error(error); // Log the error for debugging
    response.status(500).json({ message: 'Error updating training IDs', error });
  }
}

export async function findEmployeesByTrainingId(
  request: Request<{ trainingId: string }, {}, {}>,
  response: Response
): Promise<any> {
  const { trainingId } = request.params; // Extract the training ID from the request parameters

  try {

    // Find all employees with the specified training ID
    const employees = await EmployeeManagement.find({ trainingIds: trainingId });

    if (employees.length === 0) {
      return response.status(404).json({ message: 'No employees found with the specified training ID' });
    }

    response.status(200).json(employees);
  } catch (error) {
    console.error(error); // Log the error for debugging
    response.status(500).json({ message: 'Error retrieving employees', error });
  }
}