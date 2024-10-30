import { Request, Response } from 'express';
import Batch from '../models/batchModel';
import TrainerFeedback from '../models/trainerFeedbackModel';
import { CreateBatchDto, GetBatchResponse } from '../dtos/batch.dto';
import { CreateTrainerFeedbackDto, TrainerFeedbackResponse } from '../dtos/trainerFeedback.dto';

export const createBatch = async (req: Request<{}, {}, CreateBatchDto>, res: Response<GetBatchResponse>) => {
    const { trainingRequirementId } = req.body;

    try {
        const newBatch = new Batch({ trainingRequirementId });
        await newBatch.save();

        res.status(201).json({ success: true, data: newBatch });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ success: false, message, data: null });
    }
};

export const getAllBatches = async (req: Request, res: Response<GetBatchResponse>) => {
    try {
        const batches = await Batch.find();
        res.status(200).json({ success: true, data: batches });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ success: false, message, data: null });
    }
};

export const addFeedback = async (req: Request<{}, {}, CreateTrainerFeedbackDto>, res: Response<TrainerFeedbackResponse>) => {
    const { batchId, feedback } = req.body;

    try {
        const newFeedback = new TrainerFeedback({ batchId, feedback });
        await newFeedback.save();

        res.status(201).json({ success: true, data: newFeedback });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ success: false, message, data: null });
    }
};
