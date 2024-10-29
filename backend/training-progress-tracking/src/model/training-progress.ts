import mongoose from "mongoose";

export interface  ITrainingProgress extends Document{
    trainerId:mongoose.Types.ObjectId,
    trainingRequirementId:mongoose.Types.ObjectId,
    employeeId:mongoose.Types.ObjectId,
    progress:number,
    status:'not started' | 'in progress' | 'completed',
    startedAt?:Date,
    completedAt?:Date;

}

const TrainingProgressSchema=new mongoose.Schema({
    trainerId:{
        type:mongoose.Types.ObjectId,
        required:true
    }
    ,
    trainingRequirementId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    employeeId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    progress:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        enum:['not started','in progress','completed'],
        
    },
    startedAt:{
        type:Date
    },
    completedAt:{
        type:Date
    }
})
export default mongoose.model<ITrainingProgress>('TrainingProgress',TrainingProgressSchema)