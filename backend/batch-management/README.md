API Documentation: 
batch-management

Base URL- api/v1/batch-management

1. Create a New Batch

Endpoint: POST /api/v1/batch-management

Description: Creates one or more batches of employees for a given training requirement.

Request Body (JSON):

{
    "trainingRequirementId": "60b7d3fd3407b3f1d4f1bb7a",  // Training requirement ID (ObjectId)
    "batches": [
        {
            "batchNumber": 1,
            "range": "85 - 80",
            "duration": "4 weeks",
            "trainerId": "60b7d6f63407b3f1d4f1bb7b",  // Trainer ID (ObjectId)
            "employees": [
                { "email": "employee1@example.com" }, 
                { "email": "employee2@example.com" }
            ]
        }
    ]
}

Response (JSON):
{
    "success": true,
    "data": [
        {
            "trainingRequirementId": "60b7d3fd3407b3f1d4f1bb7a",
            "batchNumber": 1,
            "trainerId": "60b7d6f63407b3f1d4f1bb7b",
            "employeeIds": ["cognitoId1", "cognitoId2"],  // Cognito IDs of the employees
            "duration": "4 weeks",
            "range": "85 - 80",
            "count": 2,
            "createdAt": "2024-11-05T12:34:56.789Z"
        }
    ]
}

Errors:

400 Bad Request if no batches are provided, or if a batch has no employees.

500 Internal Server Error if there’s an issue fetching employee Cognito IDs or creating the batch.



