import TrainerManagement, { ITrainer } from "../models/trainer-management";
import { Request, Response } from "express";
import axios from "axios";
import mongoose from "mongoose";


export async function createTrainer(
    request: Request<{}, ITrainer, Omit<ITrainer, '_id' | 'createdAt' | 'updatedAt'>>,
    response: Response<ITrainer | { message: string; error?: string }>
): Promise<any> {
    const { cognitoId, name, email, expertise, bio, trainingIds } = request.body;

    try {
        // Create a new trainer instance
        const trainer = new TrainerManagement({
            cognitoId,
            name,
            email,
            expertise,
            bio,
            trainingIds

        });

        // Save the trainer to the database
        await trainer.save();

        // Respond with the created trainer
        return response.status(201).json(trainer);
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Error creating trainer', error });
    }
}

export async function getAllTrainers(
    request: Request,
    response: Response<ITrainer[] | { message: string; error?: string }>
): Promise<any> {
    try {
        const trainers = await TrainerManagement.find({}, 'cognitoId name email expertise bio trainingIds batchIDs createdAt updatedAt');
        console.log(trainers);

        return response.status(200).json(trainers);
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Error retrieving trainers', error });
    }
}


export async function getTrainerById(
    request: Request<{ trainingId: string }>,
    response: Response<ITrainer | { message: string; error?: string }>
): Promise<any> {
    const { trainingId } = request.params;

    try {

        // Find the trainer where the trainingId is in the trainingIds array
        const trainer = await TrainerManagement.findOne({
            trainingIds: { $in: [trainingId] }
        });

        if (!trainer) {
            return response.status(404).json({ message: 'Trainer not found' });
        }

        return response.status(200).json(trainer); // Respond with the found trainer
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Error retrieving trainer', error });
    }
}


export async function updateTrainer(
    request: Request<{ cognitoId: string }, ITrainer, Partial<Omit<ITrainer, '_id' | 'createdAt' | 'updatedAt'>>>,
    response: Response<ITrainer | { message: string; error?: string }>
): Promise<any> {
    const { cognitoId } = request.params; // Extract the trainer ID from URL parameters
    const updateData = request.body; // Get the update data from the request body

    try {
        // Fetch the trainer from the database
        const trainer = await TrainerManagement.findOne({ cognitoId });

        // If the trainer doesn't exist, return a 404 response
        if (!trainer) {
            return response.status(404).json({ message: 'Trainer not found' });
        }

        // Add the new trainingIds and batchIDs to the existing lists without duplicates
        if (updateData.trainingIds) {
            trainer.trainingIds = [
                ...new Set([...trainer.trainingIds, ...updateData.trainingIds])
            ];
        }

        if (updateData.batchIDs) {
            trainer.batchIDs = [
                ...new Set([...trainer.batchIDs, ...updateData.batchIDs])
            ];
        }


        // Save the trainer document, using versioning control
        await trainer.save();

        // Return the updated trainer document
        return response.status(200).json(trainer);

    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Error updating trainer', error });
    }
}



export async function deleteTrainer(
    request: Request<{ id: string }>,
    response: Response<{ message: string } | { message: string; error?: string }>
): Promise<any> {
    const { id } = request.params; // Extract the trainer ID from URL parameters

    try {
        const trainer = await TrainerManagement.findByIdAndDelete(id); // Delete trainer by ID
        if (!trainer) {
            return response.status(404).json({ message: 'Trainer not found' });
        }
        return response.status(200).json({ message: 'Trainer deleted successfully' }); // Respond with a success message
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Error deleting trainer', error });
    }
}



export async function getTrainersForDropdown(
    request: Request,
    response: Response
): Promise<any> {
    try {
        // Step 1: Fetch all trainers, only retrieving cognitoId, name, and expertise
        const trainers = await TrainerManagement.find(
            {}, // Empty filter to get all trainers
            { cognitoId: 1, name: 1, expertise: 1 } // Projection: only these fields are returned
        );

        // Step 2: If no trainers found, return a 404
        if (trainers.length === 0) {
            return response.status(404).json({ message: 'No trainers found' });
        }

        // Step 3: Return the list of trainers
        return response.status(200).json(trainers);
    } catch (error) {
        // Step 4: Error handling
        console.error('Error fetching trainers:', error);
        return response.status(500).json({ message: 'Internal server error', error: error.message });
    }
}


export async function getTrainingsAllocatedForATrainer(
    request: Request,
    response: Response
): Promise<any> {
    try {
        // Step 1: Extract the trainer's cognitoId from the request parameters
        const { cognitoId } = request.params;

        // Step 2: Find the trainer from the database using the cognitoId
        const trainer: ITrainer | null = await TrainerManagement.findOne({ cognitoId }).exec();

        // If the trainer does not exist
        if (!trainer) {
            return response.status(404).json({ message: 'Trainer not found' });
        }

        // Step 3: Get the list of trainingIds assigned to the trainer
        const trainingIds = trainer.trainingIds;

        // If no trainings are assigned to this trainer
        if (trainingIds.length === 0) {
            return response.status(404).json({ message: 'No trainings assigned to this trainer' });
        }

        // Step 4: Request detailed training data from the Training Requirements Microservice
        const trainingDetailsResponse = await axios.post(
            `${process.env.TRAINING_REQUIREMENTS_MS_URL}/api/v1/training-requirements/getTrainingDetailsByIds`,
            { trainingIds }
        );

        // Step 5: If no training details are returned
        if (!trainingDetailsResponse.data || trainingDetailsResponse.data.trainings.length === 0) {
            return response.status(404).json({ message: 'Training details not found for the given trainingIds' });
        }

        // Step 6: Send back the training details to the frontend
        return response.status(200).json({ trainings: trainingDetailsResponse.data.trainings });
    } catch (error) {
        console.error("Error fetching training details for trainer:", error);
        return response.status(500).json({ message: 'Internal server error' });
    }
}


/**
 * Fetch a trainer by their Cognito ID
 * @param req - The Express Request object, where `req.params.cognitoId` contains the Cognito ID.
 * @param res - The Express Response object.
 */
export const getTrainerByCognitoId = async (req: Request, res: Response): Promise<any> => {
    try {
      const { cognitoId } = req.params;  // Get cognitoId from request params
  
      // Validate if cognitoId is provided
      if (!cognitoId) {
        return res.status(400).json({ message: 'Cognito ID is required' });
      }
  
      // Fetch the trainer by cognitoId
      const trainer = await TrainerManagement.findOne({ cognitoId });
  
      // If trainer not found
      if (!trainer) {
        return res.status(404).json({ message: 'Trainer not found' });
      }
  
      // Return the trainer details
      res.status(200).json({
        name: trainer.name,
        email: trainer.email,
        expertise: trainer.expertise,
        bio: trainer.bio,
        trainingIds: trainer.trainingIds,
        batchIDs: trainer.batchIDs,
        createdAt: trainer.createdAt,
        updatedAt: trainer.updatedAt,
      });
    } catch (error) {
      console.error('Error fetching trainer:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };