import { Request, Response } from 'express'
import TrainingRequirement, { ITrainingRequirement } from '../models/trainingRequirement.model';
import { CreateTrainingRequirementDto, UpdateTrainingRequirementDto, UpdateTrainingRequirementStatusDto } from '../dtos/trainingRequirements.dto';
import axios from 'axios';
import mongoose from 'mongoose';
import { log } from 'console';
export async function createTrainingRequirement(
    request: Request<{}, {}, CreateTrainingRequirementDto>,
    response: Response
) {
    try {
        const newRequirement = new TrainingRequirement(request.body);
        console.log(request.body);
        console.log(newRequirement);
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
        console.log(summaryData);
        const responsedata = await axios.post(`${process.env.AI_SUMMARY_MS_URL}/api/v1/summaries/generate`, summaryData);
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
    request: Request<{ id: string }, {}, { batchIds: string }>,
    response: Response<{ message?: string; updatedRequirement?: any } | { message: string }>
): Promise<any> {
    const { batchIds } = request.body;

    try {
        const updatedRequirement = await TrainingRequirement.findByIdAndUpdate(
            request.params.id,
            { batchIds },
            { new: true, runValidators: true }
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
          
          // Step 2: Fetch user names concurrently for each cognitoId
          const enrichedTrainingData = await Promise.all(trainingData.map(async item => {
              try {
                  const userResponse = await axios.get(`${process.env.AUTH_MS_URL}/api/auth/${item._id}`);
                  const user = userResponse.data; // Assuming user has the name property
                  
                  return {
                      cognitoId: item._id,
                      name: user.name,  // Assuming the response contains 'name'
                      trainingCount: item.trainingCount
                  };
              } catch (userError) {
                  console.error('Error fetching user data:', userError);
                  return {
                      cognitoId: item._id,
                      name: 'Unknown',  // Fallback in case of error
                      trainingCount: item.trainingCount
                  };
              }
          }));
  
          // Step 3: Return the enriched training data
          response.status(200).json({ trainingRequirements: enrichedTrainingData });
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
export async function getTrainingRequirementUnderAManager(
    request: Request<{ id: string }, {}, {}>, 
    response: Response
): Promise<any> {
    const { id } = request.params; // Extract the ID from the URL parameters
    try {
        // Step 2: Find the training requirement by its ID
        const trainingRequirement = await TrainingRequirement.findById(id);

        // Step 3: If the training requirement doesn't exist, return a 404 error
        if (!trainingRequirement) {
            return response.status(404).json({ message: 'Training requirement not found' });
        }

        // Step 4: Return the found training requirement
        return response.status(200).json(trainingRequirement);

    } catch (error) {
        // Step 5: Handle errors and return a 500 status with the error message
        console.error('Error retrieving training requirement:', error);
        return response.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

export async function getTrainingRequirementsByManager( 
    request: Request<{ id: string }, {}, {}>, 
    response: Response
): Promise<any> {

    const { id } = request.params; 
    console.log(id);
    
    try {
        // Step 1: Fetch all training requirements created by the manager (cognitoId)
        const trainingRequirements = await TrainingRequirement.find({ cognitoId: id });

        if (!trainingRequirements || trainingRequirements.length === 0) {
            return response.status(404).json({ message: 'No training requirements found for the given manager.' });
        }

        // Step 2: Initialize an array to store the aggregated results.
        const result = [];

        // Step 3: Iterate through each training requirement to fetch trainer and batch details
        for (const training of trainingRequirements) {
            const { _id, trainingName, batchIds } = training;

            // 1. Fetch trainer details for the current training from the trainer-management microservice
            let trainerDetails = null;

            // 2. If batchIds is not empty, fetch batch details from the batch-management microservice
            let batchDetails = null;
            if (batchIds && batchIds.length > 0) {
                try {
                    // Fetch batch details using batchIds
                    const batchResponses = await Promise.all(
                        batchIds.map(async (batchId) => {
                            try {
                                // Fetch batch details for each batchId
                                const batchResponse = await axios.get(`${process.env.BATCH_MANAGEMENT_URL}/api/v1/batch-management/${batchId}`);
                                
                                const batchData = batchResponse.data;

                                // If batch data exists, fetch trainer details for the batch
                                if (batchData) {
                                    // Fetch trainer details for the current batch's trainerId
                                    const batchTrainerResponse = await axios.get(
                                        `${process.env.TRAINER_MANAGEMENT_URL}/api/v1/trainer-management/trainers/getTrainerByCognitoId/${batchData.trainerId}`
                                    );
                                    batchData.trainerDetails = batchTrainerResponse.data;
                                }

                                return batchData;
                            } catch (error) {
                                console.error(`Error fetching batch details for batchId: ${batchId}`, error);
                                return null;  // If there is an error fetching the batch, return null
                            }
                        })
                    );

                    // Filter out any null responses (in case fetching batch data fails)
                    batchDetails = batchResponses.filter(batch => batch !== null);
                } catch (error) {
                    console.error('Error fetching batch details:', error);
                }
            }

            // Step 4: Push the aggregated data for the current training to the result array
            result.push({
                _id,
                trainingName,
                trainer: trainerDetails,  // Trainer details fetched from the trainer microservice (if no batches)
                batchDetails,            // Batch details fetched from the batch service (if any)
            });
        }

        // Step 5: Return the aggregated result in the response
        return response.status(200).json({
            success: true,
            data: result,
        });

    } catch (error) {
        console.error('Error retrieving training details for manager:', error);
        return response.status(500).json({ message: 'Internal server error' });
    }
}



export const getTrainingDetailsByIds = async (
    req: Request<{}, {}, { trainingIds: string[] }>,
    res: Response<{ 
        trainings: (mongoose.Document<unknown, {}, ITrainingRequirement> & ITrainingRequirement & Required<{ _id: unknown }> & { __v?: number })[] | undefined;} | {message?: string }>
): Promise<any> => {
    try {
        // Step 1: Get the list of trainingIds from the request body
        const { trainingIds } = req.body;

        // Step 2: Fetch the training details from the Training Requirements database using the trainingIds
        const trainings = await TrainingRequirement.find({
            '_id': { $in: trainingIds }
        }).exec();

        // Step 3: If no trainings found
        if (!trainings || trainings.length === 0) {
            return res.status(404).json({ message: 'No training details found for the provided trainingIds' });
        }

        // Step 4: Return the training details
        return res.status(200).json({ trainings });
    } catch (error) {
        console.error("Error fetching training details:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};



export const getTrainingDetailsByTrainer = async (
    req: Request<{ cognitoId: string }, {}, {}>,
    res: Response<{ success: boolean, message: string } | { success: boolean, data: any }>
): Promise<any> => {
    try {
        const { cognitoId } = req.params;

        // Step 1: Fetch all training requirements where there are batchIds
        const trainingRequirements = await TrainingRequirement.find({ batchIds: { $exists: true, $not: { $size: 0 } } }).exec();
        console.log(trainingRequirements);
        

        if (!trainingRequirements || trainingRequirements.length === 0) {
            return res.status(404).json({ success: false, message: 'No training requirements found.' });
        }

        // Step 2: Initialize an array to store the aggregated training and batch details
        const result = [];

        // Step 3: Iterate through each training requirement and fetch the associated batch details
        for (const training of trainingRequirements) {
            const { _id, trainingName, batchIds } = training;

            // Step 3a: Fetch batch details from batch-management for all batchIds in the training
            let batchDetails = null;
            if (batchIds && batchIds.length > 0) {
                try {
                    // Send requests to the batch-management service for each batchId
                    const batchResponses = await Promise.all(
                        batchIds.map(async (batchId) => {
                            try {
                                // Fetch batch details for each batchId
                                const batchResponse = await axios.get(`${process.env.BATCH_MANAGEMENT_URL}/api/v1/batch-management/${batchId}`);
                                const batchData = batchResponse.data;
                                console.log("***", batchData);
                                

                                // Check if the trainer for this batch matches the provided cognitoId
                                if (batchData && batchData.trainerId === cognitoId) {
                                    // Fetch trainer details for this batch
                                    const batchTrainerResponse = await axios.get(
                                        `${process.env.TRAINER_MANAGEMENT_URL}/api/v1/trainer-management/trainers/getTrainerByCognitoId/${batchData.trainerId}`
                                    );
                                    batchData.trainerDetails = batchTrainerResponse.data;
                                    return batchData;  // Return batch details only if the trainer matches
                                }

                                return null;  // Skip this batch if the trainer doesn't match
                            } catch (error) {
                                console.error(`Error fetching batch details for batchId: ${batchId}`, error);
                                return null;
                            }
                        })
                    );

                    // Filter out any null results (batches where the trainer doesn't match or errors occurred)
                    batchDetails = batchResponses.filter(batch => batch !== null);
                } catch (error) {
                    console.error('Error fetching batch details:', error);
                }
            }

            // Step 4: If there are any batches assigned to the trainer, add to result
            if (batchDetails && batchDetails.length > 0) {
                result.push({
                    _id,
                    trainingName,
                    batchDetails,  // Only include batches where the trainer is assigned
                });
            }
        }

        // Step 5: Return the aggregated result in the response
        return res.status(200).json({
            success: true,
            data: result,
        });

    } catch (error) {
        console.error('Error retrieving training details for trainer:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
