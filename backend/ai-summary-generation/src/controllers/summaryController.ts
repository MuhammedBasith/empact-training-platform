import { Request, Response } from 'express';
import { Summary } from '../models/summaryModel';
import { CreateSummaryDTO, EditSummaryDTO, ConfirmSummaryDTO } from '../dtos/Summary.dto';
import { generateTrainingSummaryPrompt } from '../prompts/trainingPrompts';
import axios from 'axios';


// TODO Add logic for generating summary.
export const generateSummary = async (req: Request<{}, {}, CreateSummaryDTO>, res: Response) => {
  const { trainingRequirementId, department, trainingType, duration, objectives } = req.body;

  try {
    // Generate the prompt
    const prompt = generateTrainingSummaryPrompt(department, trainingType, duration, objectives);
    
    // Call to the AI service (Gemini or whichever you use)
    const response = await axios.post('YOUR_AI_SERVICE_API_ENDPOINT', {
      prompt,
      // Include any other parameters required by the AI API
    });

    const summaryText = response.data.summary; // Adjust based on the actual response structure from the AI API

    // Create a new summary entry in your database
    const newSummary = new Summary({
      trainingRequirementId,
      summary: summaryText,
    });

    await newSummary.save();
    res.status(201).json(newSummary);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Error generating summary' });
  }
};

export const getSummary = async (req: Request, res: Response): Promise<any> => {
  const { requirementId } = req.params;
  
  try {
    const summary = await Summary.findById(requirementId);
    if (!summary) {
      return res.status(404).json({ error: 'Summary not found' });
    }
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving summary' });
  }
};

export const editSummary = async (req: Request<{ requirementId: string }, {}, EditSummaryDTO>, res: Response): Promise<any> => {
  const { requirementId } = req.params;
  const { editedSummary } = req.body;

  try {
    const updatedSummary = await Summary.findByIdAndUpdate(requirementId, { editedSummary }, { new: true });
    if (!updatedSummary) {
      return res.status(404).json({ error: 'Summary not found' });
    }
    res.json(updatedSummary);
  } catch (error) {
    res.status(500).json({ error: 'Error editing summary' });
  }
};

export const confirmSummary = async (req: Request<{ requirementId: string }, {}, ConfirmSummaryDTO>, res: Response): Promise<any> => {
  const { requirementId } = req.params;
  const { confirmed } = req.body;

  try {
    const updatedSummary = await Summary.findByIdAndUpdate(requirementId, { confirmed }, { new: true });
    if (!updatedSummary) {
      return res.status(404).json({ error: 'Summary not found' });
    }
    res.json(updatedSummary);
  } catch (error) {
    res.status(500).json({ error: 'Error confirming summary' });
  }
};
