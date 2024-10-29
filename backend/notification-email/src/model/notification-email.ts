import mongoose, { Schema, Document } from 'mongoose';

// Interface for Notification
export interface INotification extends Document {
   
    type: 'baselineAssessment' | 'trainingUpdate'; // Type of notification
    content: string; // Content of the notification
    sentAt: Date; // Timestamp when the notification was sent
    status: 'sent' | 'failed'; // Status of the notification
}

// Schema for Notification
const NotificationSchema: Schema = new Schema(
    {
        recipientId: { type: mongoose.Types.ObjectId, ref: 'users', required: true },
        type: { type: String, enum: ['baselineAssessment', 'trainingUpdate'], required: true },
        content: { type: String, required: true },
        sentAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['sent', 'failed'], default: 'sent' }
    },
    { timestamps: false } // Set timestamps to false
);

// Export the model
export default mongoose.model<INotification>('Notification', NotificationSchema);
