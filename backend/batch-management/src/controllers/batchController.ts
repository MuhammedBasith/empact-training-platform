import { Request, Response } from 'express';
import Batch, { IBatch } from '../models/batchModel';
import { CreateBatchDto, GetBatchResponse } from '../dtos/batch.dto';
import { CreateTrainerFeedbackDto, TrainerFeedbackResponse } from '../dtos/trainerFeedback.dto';
import mongoose from 'mongoose';
import axios from 'axios';

export async function createBatch(request: Request, response: Response) {
    try {
        const { trainingRequirementId, batches } = request.body;
        console.log(request.body)

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
                const { email } = employee;

                try {
                    // Send request to the user-auth-microservice to get cognitoId by email
                    const responseFromAuthService = await axios.get(
                        `http://localhost:3001/api/auth/${email}`  // Assuming the endpoint for user-auth microservice
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
                cognitoId,  // Assuming trainerId is passed as an ObjectId
                employeeIds: employeeCognitoIds,  // List of employee cognitoIds
                duration,  // The batch duration (string)
                range,     // The batch range (e.g., "85 - 80")
                count: employees.length,  // Number of employees in the batch
                createdAt: new Date()  // Store the date the batch is created
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
    request: Request<{ id: string }, {}, { trainerID: mongoose.Types.ObjectId }>,
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
    request: Request<{ batchId: string }>, // batchId will be passed as a URL parameter
    response: Response<IBatch | { message: string; error?: string }>
): Promise<any> {
    const { batchId } = request.params; // Extract the batchId from URL parameters

    try {
        // Find the batch by ID using `findById`
        const batch = await Batch.findById(batchId);
        
        // If batch is not found, return a 404
        if (!batch) {
            return response.status(404).json({ message: 'Batch not found' });
        }

        // Return the found batch
        return response.status(200).json(batch);
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Error retrieving batch' });
    }
}