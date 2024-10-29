import { Request, Response } from 'express'
import TrainingRequirement, { ITrainingRequirement } from '../models/trainingRequirement.model';
import { CreateTrainingRequirementDto, UpdateTrainingRequirementDto, UpdateTrainingRequirementStatusDto } from '../dtos/trainingRequirements.dto';

export async function createTrainingRequirement(
    request: Request<{}, {}, CreateTrainingRequirementDto>,
    response: Response
) {
    try {
        const newRequirement = new TrainingRequirement(request.body);
        await newRequirement.save();
        response.status(201).json(newRequirement);
    } catch (error) {
        response.status(500).json({ message: 'Error creating training requirement', error });
    }
}


export async function getTrainingRequirement(
    request: Request<{ id: string }>,
    response: Response<ITrainingRequirement | { message: string, error?: string }>
): Promise<any> {
    try {
        const requirement = await TrainingRequirement.findById(request.params.id);
        if (!requirement) {
            return response.status(404).json({ message: 'Training requirement not found' });
        }
        return response.json(requirement);
    } catch (error) {
        return response.status(500).json({ message: 'Error retrieving training requirement', error });
    }
}


export async function getAllTrainingRequirements(
    request: Request,
    response: Response
) {
    try {
        const requirements = await TrainingRequirement.find();
        response.json(requirements);
    } catch (error) {
        response.status(500).json({ message: 'Error retrieving training requirements', error });
    }
}

export async function updateTrainingRequirement(
    request: Request<{ id: string }, {}, UpdateTrainingRequirementDto>,
    response: Response<UpdateTrainingRequirementDto | {message?: string, error?: string}>
): Promise<any> {
    try {
        const updatedRequirement = await TrainingRequirement.findByIdAndUpdate(request.params.id, request.body, { new: true });
        if (!updatedRequirement) {
            return response.status(404).json({ message: 'Training requirement not found' });
        }
        response.json(updatedRequirement);
    } catch (error) {
        response.status(500).json({ message: 'Error updating training requirement', error });
    }
}

export async function deleteTrainingRequirement(
    request: Request<{ id: string }>,
    response: Response<{message?:string, error?: string}>
): Promise<any> {
    try {
        const deletedRequirement = await TrainingRequirement.findByIdAndDelete(request.params.id);
        if (!deletedRequirement) {
            return response.status(404).json({ message: 'Training requirement not found' });
        }
        response.status(204).send();
    } catch (error) {
        response.status(500).json({ message: 'Error deleting training requirement', error });
    }
}



export const confirmRequirement = async (req: Request<{ requirementId: string }, {}, UpdateTrainingRequirementStatusDto>, res: Response): Promise<any> => {
    const { requirementId } = req.params;
    const { status } = req.body;
  
    try {
      const updatedRequirement = await TrainingRequirement.findByIdAndUpdate(requirementId, { status }, { new: true });
      if (!updatedRequirement) {
        return res.status(404).json({ error: 'Requirement not found' });
      }
      res.json(updatedRequirement);
    } catch (error) {
      res.status(500).json({ error: 'Error confirming Requirement' });
    }
  };
  