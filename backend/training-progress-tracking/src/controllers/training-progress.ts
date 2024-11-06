import { Request, Response } from "express";
import TrainerFeedbackWithProgress, { ITrainerFeedbackWithProgress } from "../models/training-progress";
import mongoose from "mongoose";

export const createTrainerFeedbackWithProgress = async (req: Request, res: Response): Promise<any> => {
    const {
        batchId,
        trainerId,
        trainingId,  // Updated to match the new schema
        cognitoId,
        feedback, // Added feedback field
        progress = 0, 
        status = 'not started', 
        startedAt,
        completedAt
    } = req.body;

    // Validate required fields
    if (!trainerId || !trainingId || !cognitoId || !feedback) {
        return res.status(400).json({ message: 'Trainer ID, Training ID, Employee ID, and Feedback are required' });
    }

    // Create a new training progress document
    const newTrainerFeedbackWithProgress = new TrainerFeedbackWithProgress({
        batchId,
        trainerId,
        trainingId,
        cognitoId,
        feedback,  // Added feedback field to the document
        progress,
        status,
        startedAt,
        completedAt
    });

    try {
        const savedTrainerFeedbackWithProgress = await newTrainerFeedbackWithProgress.save();
        return res.status(201).json(savedTrainerFeedbackWithProgress); // Return the created document
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error creating training progress', error: error.message });
    }
};

// GET /api/training-progress
export const getAllTrainerFeedbackWithProgress = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        const trainerFeedbackWithProgressRecords = await TrainerFeedbackWithProgress.find();
        return res.status(200).json(trainerFeedbackWithProgressRecords);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving training progress', error: error.message });
    }
};

export const getTrainerFeedbackWithProgressBycognitoId = async (
    req: Request<{ trainingId: string,cognitoId: string }>, // Expecting an ID parameter
    res: Response
): Promise<any> => {
    const { cognitoId, trainingId } = req.params; // Get the ID from the request parameters

    try {
        // Fetch the training progress record by ID from the database
        const trainerFeedbackWithProgressRecord = await TrainerFeedbackWithProgress.find({
            trainingId: new mongoose.Types.ObjectId(trainingId),
            cognitoId: new mongoose.Types.ObjectId(cognitoId)});

        // Check if the record was found
        if (!trainerFeedbackWithProgressRecord) {
            return res.status(404).json({ message: 'Training progress record not found' });
        }

        // Return the found record with a 200 OK status
        return res.status(200).json(trainerFeedbackWithProgressRecord);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving training progress', error: error.message });
    }
};

export const updateTrainerFeedbackWithProgress = async (
    req: Request<{ id: string }, {}, { status?: string; progress?: number; feedback?: string }>, // Added feedback as optional
    res: Response
): Promise<any> => {
    const { id } = req.params; // Get the ID from the request parameters
    const { status, progress, feedback } = req.body; // Get status, progress, and feedback from the request body

    try {
        // Update the training progress record by ID
        const updatedTrainerFeedbackWithProgress = await TrainerFeedbackWithProgress.findByIdAndUpdate(
            id,
            {
                ...(status && { status }), // Only update if status is provided
                ...(progress !== undefined && { progress }), // Only update if progress is provided
                ...(feedback && { feedback }) // Only update if feedback is provided
            },
            { new: true } // Return the updated document
        );

        // Check if the record was found
        if (!updatedTrainerFeedbackWithProgress) {
            return res.status(404).json({ message: 'Training progress record not found' });
        }

        // Return the updated record with a 200 OK status
        return res.status(200).json(updatedTrainerFeedbackWithProgress);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating training progress', error: error.message });
    }
};
