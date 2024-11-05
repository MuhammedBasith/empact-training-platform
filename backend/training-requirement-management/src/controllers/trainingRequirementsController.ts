import { Request, Response } from 'express'
import TrainingRequirement, { ITrainingRequirement } from '../models/trainingRequirement.model';
import { CreateTrainingRequirementDto, UpdateTrainingRequirementDto, UpdateTrainingRequirementStatusDto } from '../dtos/trainingRequirements.dto';
import axios from 'axios';
import mongoose from 'mongoose';
export async function createTrainingRequirement(
    request: Request<{}, {}, CreateTrainingRequirementDto>,
    response: Response
) {
    try {
        const newRequirement = new TrainingRequirement(request.body);
        await newRequirement.save();
        const trainingRequirementId = newRequirement._id;
        console.log(trainingRequirementId);
        
        const summaryData = {
            trainingRequirementId,
            batchIds: newRequirement.batchIds,
            department: newRequirement.department,
            trainingName: newRequirement.trainingName,
            trainingType: newRequirement.trainingType,
            duration: newRequirement.duration,
            objectives: newRequirement.objectives,
            empCount: newRequirement.empCount,
            prerequisite: newRequirement.prerequisite,
            skills_to_train: newRequirement.skills_to_train
            
        };
        const responsedata = await axios.post('http://localhost:5000/api/v1/summaries/generate', summaryData);
        const data = responsedata.data.summary

        response.status(201).json({...summaryData, summary: data});
    } catch (error) {
        response.status(500).json({ message: 'Error creating training requirement', error });
    }
}


export async function getTrainingRequirement(
    request: Request<{ cognitoId: string; id: string}>,
    response: Response<ITrainingRequirement | { message: string, error?: string }>
): Promise<any> {
    const { cognitoId,id } = request.params;

    try {
        // Find the training requirement by cognitoId and trainingId
        const trainingRequirement = await TrainingRequirement.findOne({
            _id: id,
            cognitoId: cognitoId
        });

        if (!trainingRequirement) {
            return response.status(404).json({ message: 'Training requirement not found' });
        }

        response.status(200).json(trainingRequirement);
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Error retrieving training requirement', error });
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

export async function updateEmployeeCount(
    request: Request<{ id: string }, {}, { empCount: number }>,
    response: Response<{ empCount: number } | { message?: string; error?: string }>
): Promise<any> {
    const { empCount } = request.body;

    // Validate empCount
    if (typeof empCount !== 'number') {
        return response.status(400).json({ message: 'Invalid employee count. Must be a number.' });
    }

    try {
        const updatedRequirement = await TrainingRequirement.findByIdAndUpdate(
            request.params.id,
            { empCount }, // Update only the empCount field
            { new: true } // Return the updated document
        );

        if (!updatedRequirement) {
            return response.status(404).json({ message: 'Training requirement not found' });
        }

        response.json(updatedRequirement);
    } catch (error) {
        response.status(500).json({ message: 'Error updating employee count', error });
    }
}
export async function updateBatchIds(
    request: Request<{ id: string }, {}, { batchIds: mongoose.Types.ObjectId[] }>,
    response: Response<{ message?: string; updatedRequirement?: any } | { message: string }>
): Promise<any> {
    const { batchIds } = request.body;

    try {
        const updatedRequirement = await TrainingRequirement.findByIdAndUpdate(
            request.params.id,
            { batchIds }, // Update the batchIds field
            { new: true, runValidators: true } // Return the updated document and run validation
        ).exec();

        if (!updatedRequirement) {
            return response.status(404).json({ message: 'Training requirement not found' });
        }

        response.json({ message: 'Batch IDs updated successfully', updatedRequirement });
    } catch (error) {
        console.error(error); // Log error for debugging
        response.status(500).json({ message: 'Error updating batch IDs' });
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
  
  export async function getTrainingRequirementsByManager(
    request: Request<{ id:string }, {}, {}>,
    response: Response<{ trainingRequirements: ITrainingRequirement[] } | { message: string }>
): Promise<any> {
    const { id } = request.params;

    // Validate managerId (ensure it is a valid ObjectId)
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(400).json({ message: 'Invalid manager ID. Must be a valid ObjectId.' });
    }

    try {
        const trainingRequirements = await TrainingRequirement.find({ cognitoId: id}).exec();

        if (trainingRequirements.length === 0) {
            return response.status(404).json({ message: 'No training requirements found for this manager' });
        }

        response.json({ trainingRequirements });
    } catch (error) {
        console.error(error); // Log error for debugging
        response.status(500).json({ message: 'Error fetching training requirements' });
    }
}
  
export async function getTrainingRequirements(
    request: Request<{}, {}, {}>,
    response: Response<{ trainingRequirements: { cognitoId: string; name: string; trainingCount: number }[] } | { message: string }>
): Promise<any> {
    try {
        // Step 1: Aggregate training requirements by cognitoId
        const trainingData = await TrainingRequirement.aggregate([
            {
                $group: {
                    _id: '$cognitoId',
                    trainingCount: { $sum: 1 }
                }
            }
        ]);
        console.log(trainingData)
        trainingData.map(async item =>{
            const userResponse = axios.get(`http://localhost:3001/api/auth/${item._id}`);
            
            const users = (await userResponse).data;
            console.log(users)
            return {
                cognitoId: item._id,
                name: users.name || 'Unknown', // Fallback if name is missing
                trainingCount: item.trainingCount
            };
           
        })
        } catch (error) {
        console.error('Error retrieving training requirements:', error);
        return response.status(500).json({ message: 'Internal server error' });
    }
}

export async function getEmpCountById(
    request: Request<{ id: string }, {}, {}>,
    response: Response<{trainingRequirementId: string; empCount: number; trainingName: string; duration: string; skills_to_train?: string; } | { message: string }>
): Promise<any> {
    try {
        // Extract the training requirement ID from the request parameters
        const { id } = request.params;

        // Check if the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: 'Invalid ID format' });
        }

        // Find the training requirement by ID
        const trainingRequirement = await TrainingRequirement.findById(id);

        // Check if the training requirement exists
        if (!trainingRequirement) {
            return response.status(404).json({ message: 'Training requirement not found' });
        }

        // Return the employee count and training name
        return response.status(200).json({ 
            trainingRequirementId: trainingRequirement._id.toString(),
            empCount: trainingRequirement.empCount, 
            trainingName: trainingRequirement.trainingName
            ,duration: trainingRequirement.duration ,
            skills_to_train: trainingRequirement.skills_to_train
        });
    } catch (error) {
        console.error('Error retrieving employee count:', error);
        return response.status(500).json({ message: 'Internal server error' });
    }
}