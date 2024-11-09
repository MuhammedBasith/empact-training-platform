import { Request, Response } from 'express';
import { Summary } from '../models/summaryModel';
import { CreateSummaryDTO, EditSummaryDTO, ConfirmSummaryDTO } from '../dtos/Summary.dto';
import { generateTrainingSummaryPrompt } from '../prompts/trainingPrompts';
import axios from 'axios';
import GoogleGenerativeAI from '@google/generative-ai'
import { geminiModel } from '../config/gemini';
import dotenv from 'dotenv';
import { markdownToText } from '../utils/markdownToText';

dotenv.config();



export const generateSummary = async (req: Request<{}, {}, CreateSummaryDTO>, res: Response) => {
  const { trainingRequirementId, department, trainingName, trainingType, duration, objectives, prerequisite, skills_to_train } = req.body;

  console.log(req.body.trainingRequirementId);
  
  try {
    // Generate the prompt
    const prompt = generateTrainingSummaryPrompt(department, trainingName, trainingType, duration, objectives, prerequisite, skills_to_train);
    
    // Generate the summary using AI
    const result = await geminiModel.generateContent(prompt);    

    // Get the raw response from AI
    const summaryText = result.response.text(); // Adjust based on the actual response structure from the AI API
    
    // Convert the Markdown response to plain text
    const plainTextSummary = markdownToText(summaryText);
    
    // Create a new summary record
    const newSummary = new Summary({
      trainingRequirementId,
      summary: plainTextSummary,
      confirmed: false
    });

    // Save the summary to the database
    await newSummary.save();
    res.status(201).json(newSummary);
    
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Error generating summary' });
  }
};



export const getSummary = async (req: Request, res: Response): Promise<any> => {
  const { trainingRequirementId } = req.params;
  
  try {
    const summary = await Summary.findById({trainingRequirementId});
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
