# Batch Management API

## Overview

The **Batch Management API** is designed to manage the creation and management of batches in a training environment. A batch is a group of employees participating in a specific training program, led by a trainer. The API allows for the creation, updating, and retrieval of batch information.

### Key Features:
- **Create Batch**: Create one or multiple batches for a specific training requirement, including trainer and employee assignments.
- **Update Trainer**: Update the trainer assigned to a particular batch.
- **Get Batch**: Retrieve details of a specific batch by its ID.

---
### 2. **Setup & Installation**

#### **Prerequisites**

- Node.js (v14 or higher)
- MongoDB instance (local or cloud)

#### **Steps to Run the Service**

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/MuhammedBasith/empact-training-platform/batch-management.git
   cd batch-management
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Application**:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3009`.


---

## Endpoints Overview

### 1. **Create a Batch**

- **Endpoint**: `POST /api/v1/batch-management`
- **Description**: Creates new batches for a training requirement, including employees and a trainer.
- **Request Body**:
    ```json
    {
        "trainingRequirementId": "60b7d3fd3407b3f1d4f1bb7a",  
        "batches": [
            {
                "batchNumber": 1,                    
                "trainerId": "60b7d3fd3407b3f1d4f1bb8b", 
                "employees": [                        
                    { "email": "employee1@example.com" },
                    { "email": "employee2@example.com" }
                ],
                "duration": "2 weeks",              
                "range": "85-90",                  
                "count": 2                          
            }
        ]
    }
    ```
- **Response**:
    ```json
    {
        "success": true,
        "data": [
            {
                "trainingRequirementId": "60b7d3fd3407b3f1d4f1bb7a",
                "batchNumber": 1,
                "trainerId": "60b7d3fd3407b3f1d4f1bb8b",
                "employeeIds": [
                    "cognitoId1", "cognitoId2"
                ],
                "duration": "2 weeks",
                "range": "85-90",
                "count": 2,
                "createdAt": "2024-11-05T12:34:56.789Z"
            }
        ]
    }
    ```
- **Errors**:
    - `400 Bad Request`: No batches provided or batch has no employees.
    - `500 Internal Server Error`: Error creating the batch.

---

### 2. **Update Trainer for a Batch**

- **Endpoint**: `PUT /api/v1/batch-management/:id`
- **Description**: Updates the trainer assigned to a specific batch.
- **Request Body**:
    ```json
    {
        "trainerID": "60b7d3fd3407b3f1d4f1bb8b"  
    }
    ```
- **Response**:
    ```json
    {
        "message": "Trainer ID updated successfully",
        "updatedBatch": {
            "trainingRequirementId": "60b7d3fd3407b3f1d4f1bb7a",
            "batchNumber": 1,
            "trainerId": "60b7d3fd3407b3f1d4f1bb8b",
            "employeeIds": [
                "cognitoId1", "cognitoId2"
            ],
            "duration": "2 weeks",
            "range": "85-90",
            "count": 2,
            "createdAt": "2024-11-05T12:34:56.789Z"
        }
    }
    ```
- **Errors**:
    - `404 Not Found`: Batch with the specified ID does not exist.
    - `500 Internal Server Error`: Error updating the trainer.

---

### 3. **Get Batch by ID**

- **Endpoint**: `GET /api/v1/batch-management/:id`
- **Description**: Retrieves detailed information about a batch by its ID.
- **Response**:
    ```json
    {
        "trainingRequirementId": "60b7d3fd3407b3f1d4f1bb7a",
        "batchNumber": 1,
        "trainerId": "60b7d3fd3407b3f1d4f1bb8b",
        "employeeIds": [
            "cognitoId1", "cognitoId2"
        ],
        "duration": "2 weeks",
        "range": "85-90",
        "count": 2,
        "createdAt": "2024-11-05T12:34:56.789Z"
    }
    ```
- **Errors**:
    - `404 Not Found`: Batch with the specified ID does not exist.
    - `500 Internal Server Error`: Error retrieving batch details.

---

## Data Models

### Batch Model (`IBatch`)

A batch in the system consists of the following fields:

- **trainingRequirementId**: The ID of the training requirement that the batch belongs to.
- **batchNumber**: The unique identifier for the batch within a given training requirement.
- **trainerId**: The ID of the trainer assigned to this batch.
- **employeeIds**: A list of employee IDs (Cognito IDs) who are part of the batch.
- **duration**: Duration of the batch (e.g., "2 weeks").
- **range**: The performance range of the batch (e.g., "85-90").
- **count**: Number of employees in the batch.
- **createdAt**: Timestamp indicating when the batch was created.

---
