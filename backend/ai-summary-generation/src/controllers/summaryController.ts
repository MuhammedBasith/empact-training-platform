import { Request, Response } from 'express';
import { Summary } from '../models/summaryModel';
import { CreateSummaryDTO, EditSummaryDTO, ConfirmSummaryDTO } from '../dtos/SummaryDTO';

export const generateSummary = async (req: Request<{}, {}, CreateSummaryDTO>, res: Response) => {
  const { trainingRequirementId, summary } = req.body;
  
  try {
    const newSummary = new Summary({ trainingRequirementId, summary });
    await newSummary.save();
    res.status(201).json(newSummary);
  } catch (error) {
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
