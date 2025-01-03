import { Request, Response } from 'express';
import Batch, { IBatch } from '../models/batchModel';
import { CreateBatchDto, GetBatchResponse } from '../dtos/batch.dto';
import { CreateTrainerFeedbackDto, TrainerFeedbackResponse } from '../dtos/trainerFeedback.dto';
import mongoose from 'mongoose';
import axios from 'axios';
import { log } from 'console';


export async function createBatch(request: Request, response: Response) {
    try {
        const { trainingRequirementId, batches } = request.body;
        console.log(request.body.batches)
        log("*************************")

        // Ensure batches are provided
        if (!batches || batches.length === 0) {
            return response.status(400).json({ success: false, message: 'No batches provided' });
        }

        // Array to store created batches
        const createdBatches = [];

        // Process each batch
        for (const batch of batches) {
            const { batchNumber, range, duration, cognitoId, employees } = batch;

            // Ensure batch has employees
            if (!employees || employees.length === 0) {
                return response.status(400).json({ success: false, message: `Batch ${batchNumber} has no employees` });
            }
            

            // Step 1: Fetch cognitoIds for each employee
            const employeeCognitoIds = [];

            // Loop through each employee to fetch their cognitoId
            for (const employee of employees) {
                console.log(employee);
                
                const { email } = employee;

                try {
                    // Send request to the user-auth-microservice to get cognitoId by email
                    const responseFromAuthService = await axios.get(
                        `${process.env.AUTH_MS_URL}/api/auth/getUserCognitoId/${email}`  // Assuming the endpoint for user-auth microservice
                    );
  
                    if (responseFromAuthService.data && responseFromAuthService.data.cognitoId) {
                        const cognitoId = responseFromAuthService.data.cognitoId;

                        // Add the cognitoId to the employeeIds array
                        employeeCognitoIds.push(cognitoId);
                    } else {
                        console.error(`No cognitoId found for email: ${email}`);
                        return response.status(500).json({ success: false, message: `Failed to retrieve cognitoId for employee: ${email}` });
                    }
                } catch (error) {
                    // If there's an error fetching cognitoId for an employee, log and return error
                    console.error(`Error fetching cognitoId for ${email}:`, error);
                    return response.status(500).json({ success: false, message: `Failed to fetch cognitoId for ${email}` });
                }
            }

            // Step 2: Create a new batch document
            const batchData = {
                trainingRequirementId,
                batchNumber,
                trainerId: cognitoId,
                employeeIds: employeeCognitoIds, 
                duration,
                range, 
                count: employees.length,
                createdAt: new Date()
            };

            // Create batch in the database
            const createdBatch = await Batch.create(batchData);
            createdBatches.push(createdBatch);
        }

        // Respond with the created batches
        return response.status(201).json({ success: true, data: createdBatches });
    } catch (error) {
        // Catch any unexpected errors
        console.error('Error creating batches:', error);
        return response.status(500).json({ success: false, data: null, message: 'Internal server error' });
    }
}


export async function updateTrainerId(
    request: Request<{ id: string }, {}, { trainerID: string }>,
    response: Response<{ message?: string; updatedBatch?: any } | { message: string }>
): Promise<any> {
    const { trainerID } = request.body;



    try {
        const updatedBatch = await Batch.findByIdAndUpdate(
            request.params.id,
            {
                trainerID, // Update the trainerID field
                requiredEqualToTrue: false // Set requiredEqualToTrue to false
            },
            { new: true, runValidators: true } // Return the updated document and run validation
        ).exec();

        if (!updatedBatch) {
            return response.status(404).json({ message: 'Batch not found' });
        }

        response.json({ message: 'Trainer ID updated successfully', updatedBatch });
    } catch (error) {
        console.error(error); // Log error for debugging
        response.status(500).json({ message: 'Error updating trainer ID' });
    }
}


export async function getBatchById(
    request: Request<{ id: string }>,
    response: Response<IBatch | { message: string; error?: string }>
): Promise<any> {
    const { id } = request.params;

    try {
        // Find the batch by ID using `findById`
        const batch = await Batch.findById(id);
        
        // If batch is not found, return a 404
        if (!batch) {
            console.log(`Batch not found for batch id ${id}`);
            return response.status(404).json({ message: 'Batch not found' });
        }
        console.log(batch);
        
        return response.status(200).json(batch);

    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Error retrieving batch' });
    }
}

export const getBatchesByTrainingId = async (req: Request, res: Response) => {
    try {
        const { trainingId } = req.params;


        // Fetch batches from the Batch model using the trainingId
        const batches = await Batch.find({ trainingRequirementId: trainingId })
            .populate('trainerId', 'name email expertise')  // Populate trainer information for each batch
            .exec();

        if (!batches.length) {
            return res.status(404).json({ success: false, message: 'No batches found for this training' });
        }

        // Return the batches as response
        return res.json({
            success: true,
            data: batches
        });
    } catch (error) {
        console.error('Error fetching batches:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while fetching batches' });
    }
};



export const getEmployeesForBatch = async (req: Request, res: Response): Promise<any> => {
    const { batchId } = req.params; // Get batchId from the request params

    try {
        // Step 1: Fetch the batch by batchId
        const batch = await Batch.findById(batchId)
        if (!batch) {
            return res.status(404).json({ message: 'Batch not found' });
        }

        // Step 2: Extract employeeIds from the batch
        const { employeeIds } = batch;
        console.log(employeeIds);
        

        // If no employeeIds, return an empty list
        if (employeeIds.length === 0) {
            return res.status(200).json([]);
        }

        // Step 3: Fetch employee details from the employee microservice
        const employeePromises = employeeIds.map((employeeId: string) =>
            axios.get(`${process.env.EMPLOYEE_MS_URL}/api/v1/employee-management/${employeeId}`)
        );

        // Wait for all employee details to be fetched
        const employeeResponses = await Promise.all(employeePromises);

        // Step 4: Extract employee data from the responses
        const employees = employeeResponses.map(response => response.data);

        // Step 5: Return the employee details as a response
        return res.status(200).json(employees);

    } catch (error) {
        console.error('Error fetching employees for batch:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};