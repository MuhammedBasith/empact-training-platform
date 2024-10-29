import { Request,Response } from "express";
import BaselineAssessment ,{IBaselineAssessment}from "../model/baseline-assessment";
import axios from 'axios'; 
import nodemailer from 'nodemailer';


export const sendBaselineAssessments = async (
    req: Request<{ trainingId: string }>,
    res: Response
): Promise<any> => {
    const { trainingId } = req.params;

    try {
        // Fetch training details and associated employees from the training microservice
        const trainingResponse = await axios.get(`http://localhost:3000/api/v1/training-requirement-management/${trainingId}`);
        const training = trainingResponse.data;

        if (!training) {
            return res.status(404).json({ message: 'Training not found' });
        }

        const employeeIds = training.employeeIds; // Assuming training includes an array of employee IDs
        const employees = employeeIds.data;

        // Set up Nodemailer transport
        const transporter = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS, 
            },
        });

        // Send email to each employee
        const promises = employees.map(async (employee: any) => {
            const email = employee.email;
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Baseline Assessment',
                text: `Hello ${employee.name},\n\nPlease complete your baseline assessment for the training: ${training.name}.\n\nThank you!`,
            };

            // Save a baseline assessment entry in the database
            await BaselineAssessment.create({
                trainingId,
                employeeId: employee._id,
                email,
                assessmentStatus: 'pending',
            });

            return transporter.sendMail(mailOptions);
        });
        return res.status(200).json({ message: 'Baseline assessments sent successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error sending baseline assessments', error: error.message });
    }
};


export const getAssessmentResults = async (
    req: Request<{ trainingId: string }>,
    res: Response
): Promise<any> => {
    const { trainingId } = req.params;

    try {
        // Fetch baseline assessments for the specified trainingId
        const results = await BaselineAssessment.find({ trainingId })
          

        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'No assessment results found for this training.' });
        }

        return res.status(200).json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving assessment results', error: error.message });
    }
};

export const updateAssessment = async (
    req: Request<{ trainingId: string; employeeId: string }, {}, { assessmentStatus?: string; score?: number }>,
    res: Response
): Promise<any> => {
    const { trainingId, employeeId } = req.params;
    const { assessmentStatus, score } = req.body;

    try {
        // Find the assessment for the specified employeeId and trainingId
        const assessment = await BaselineAssessment.findOne({ 
            employeeId, 
            trainingId 
        });

        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found for this employee in the specified training.' });
        }

        // Update the fields that were provided
        if (assessmentStatus) {
            assessment.assessmentStatus = assessmentStatus;
        }
        if (score !== undefined) { // Check for undefined to allow 0 score
            assessment.score = score;
        }

        // Save the updated assessment
        await assessment.save();

        return res.status(200).json({ message: 'Assessment updated successfully', assessment });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating assessment', error: error.message });
    }
};
