import { Request,Response } from "express";
import TrainingProgress,{ITrainingProgress} from "../model/training-progress"


export const createTrainingProgress = async (req: Request, res: Response): Promise<any> => {
    const {
        trainerId,
        trainingRequirementId,
        employeeId,
        progress = 0, 
        status = 'not started', 
        startedAt,
        completedAt
    } = req.body;

    // Validate required fields
    if (!trainerId || !trainingRequirementId || !employeeId) {
        return res.status(400).json({ message: 'Trainer ID, Training Requirement ID, and Employee ID are required' });
    }

    // Create a new training progress document
    const newTrainingProgress = new TrainingProgress({
        trainerId,
        trainingRequirementId,
        employeeId,
        progress,
        status,
        startedAt,
        completedAt
    });

    try {
        const savedTrainingProgress = await newTrainingProgress.save();
        return res.status(201).json(savedTrainingProgress); // Return the created document
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error creating training progress', error: error.message });
    }
};
// GET /api/training-progress
export const getAllTrainingProgress = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        const trainingProgressRecords = await TrainingProgress.find();
        return res.status(200).json(trainingProgressRecords);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving training progress', error: error.message });
    }
};

export const getTrainingProgressById = async (
    req: Request<{ id: string }>, // Expecting an ID parameter
    res: Response
): Promise<any> => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        // Fetch the training progress record by ID from the database
        const trainingProgressRecord = await TrainingProgress.findById(id);

        // Check if the record was found
        if (!trainingProgressRecord) {
            return res.status(404).json({ message: 'Training progress record not found' });
        }

        // Return the found record with a 200 OK status
        return res.status(200).json(trainingProgressRecord);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving training progress', error: error.message });
    }
};

export const updateTrainingProgress = async (
    req: Request<{ id: string }, {}, { status?: string; progress?: number }>, // Expecting optional status and progress in the request body
    res: Response
): Promise<any> => {
    const { id } = req.params; // Get the ID from the request parameters
    const { status, progress } = req.body; // Get status and progress from the request body

    try {
        // Update the training progress record by ID
        const updatedTrainingProgress = await TrainingProgress.findByIdAndUpdate(
            id,
            {
                ...(status && { status }), // Only update if status is provided
                ...(progress !== undefined && { progress }), // Only update if progress is provided
            },
            { new: true } // Return the updated document
        );

        // Check if the record was found
        if (!updatedTrainingProgress) {
            return res.status(404).json({ message: 'Training progress record not found' });
        }

        // Return the updated record with a 200 OK status
        return res.status(200).json(updatedTrainingProgress);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating training progress', error: error.message });
    }
};