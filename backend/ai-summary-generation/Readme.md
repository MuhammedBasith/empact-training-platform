API Documentation: 
ai-summary-generation

Base URL- /api/v1/summaries

1. Generate a Training Summary

POST /api/v1/summaries/generate

This endpoint allows you to generate a training summary based on provided details about the training requirement.

Request Body

```json
{
  "trainingRequirementId": "60b7d3fd3407b3f1d4f1bb7a",  // Training requirement ID (ObjectId)
  "department": "Sales",  // Department conducting the training
  "trainingName": "Advanced Negotiation Skills",  // Name of the training
  "trainingType": "In-person",  // Type of training (e.g., In-person, Online)
  "duration": "4 weeks",  // Duration of the training
  "objectives": "Learn negotiation tactics for sales",  // Key objectives of the training
  "prerequisite": "Basic understanding of sales techniques",  // Prerequisites for the training
  "skills_to_train": ["Negotiation", "Persuasion", "Conflict Resolution"]  // Skills to be trained
}

```
Response

```json
{
  "trainingRequirementId": "60b7d3fd3407b3f1d4f1bb7a",
  "summary": "The training will focus on improving negotiation skills...",
  "confirmed": false,
  "generatedAt": "2024-11-05T00:00:00.000Z"
}

```

2. Get a Training Summary by ID

GET /api/v1/summaries/:trainingRequirementId

3. Edit a Training Summary

PUT /api/v1/summaries/:requirementId/edit

4. Confirm a Training Summary

POST /api/v1/summaries/:requirementId/confirm




