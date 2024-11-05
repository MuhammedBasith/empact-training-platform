
---
# Trainer Management API

## Overview

The **Trainer Management API** is part of a training management system designed to handle the creation, updating, retrieval, and deletion of trainer profiles. The API also facilitates the assignment of training programs to trainers. 

### Key Features:
- **Create Trainer**: Add new trainers with details such as name, email, expertise, and bio.
- **Retrieve Trainers**: Fetch a list of all trainers or specific trainer details by their ID.
- **Update Trainer**: Modify existing trainer details like name, expertise, and bio.
- **Delete Trainer**: Remove trainers from the system.
- **Assign Training**: Assign specific training programs to trainers.
- **Get Trainers for Dropdown**: Fetch a simplified list of trainers for use in dropdown menus or selection lists.

### Technology Stack:
- **Backend Framework**: Express.js (Node.js)
- **Database**: MongoDB with Mongoose ORM
- **Other Libraries**: Axios (for making HTTP requests), Node.js

---


## Endpoints Overview

### 1. **Create a New Trainer**

- **Endpoint:** `POST /api/v1/trainer-management/trainer`
- **Description:** Creates a new trainer record in the system.
- **Request Body (JSON):**

    ```json
    {
        "cognitoId": "60b7d3fd3407b3f1d4f1bb7a",  // Cognito ID (ObjectId)
        "name": "John Doe",                      // Trainer's full name
        "email": "john.doe@example.com",         // Trainer's email (unique)
        "expertise": ["JavaScript", "Node.js"],  // List of trainer's expertise
        "bio": "Experienced software developer"  // Optional: Bio of the trainer
    }
    ```

- **Response (JSON):**

    ```json
    {
        "cognitoId": "60b7d3fd3407b3f1d4f1bb7a",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "expertise": ["JavaScript", "Node.js"],
        "bio": "Experienced software developer",
        "trainingIds": [],
        "batchIDs": [],
        "createdAt": "2024-11-05T12:34:56.789Z",
        "updatedAt": "2024-11-05T12:34:56.789Z"
    }
    ```

- **Errors:**
    - `400 Bad Request` if required fields are missing or the data format is incorrect.
    - `500 Internal Server Error` if there’s an issue with saving the trainer.

---

### 2. **Get All Trainers**

- **Endpoint:** `GET /api/v1/trainer-management/trainers`
- **Description:** Retrieves a list of all trainers in the system.
- **Response (JSON):**

    ```json
    [
        {
            "cognitoId": "60b7d3fd3407b3f1d4f1bb7a",
            "name": "John Doe",
            "email": "john.doe@example.com",
            "expertise": ["JavaScript", "Node.js"],
            "batchIDs": []
        },
        {
            "cognitoId": "60b7d3fd3407b3f1d4f1bb7b",
            "name": "Jane Smith",
            "email": "jane.smith@example.com",
            "expertise": ["Python", "Django"],
            "batchIDs": []
        }
    ]
    ```

- **Errors:**
    - `500 Internal Server Error` if there’s an issue retrieving the trainers.

---

### 3. **Get Trainer by ID**

- **Endpoint:** `GET /api/v1/trainer-management/trainers/:trainingId`
- **Description:** Retrieves details of a specific trainer by their ID.
- **Response (JSON):**

    ```json
    {
        "cognitoId": "60b7d3fd3407b3f1d4f1bb7a",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "expertise": ["JavaScript", "Node.js"],
        "bio": "Experienced software developer",
        "trainingIds": ["60b7d3fd3407b3f1d4f1bb7c"],
        "batchIDs": [],
        "createdAt": "2024-11-05T12:34:56.789Z",
        "updatedAt": "2024-11-05T12:34:56.789Z"
    }
    ```

- **Errors:**
    - `404 Not Found` if the trainer with the specified ID does not exist.
    - `500 Internal Server Error` if there’s an issue retrieving the trainer.

---

### 4. **Update Trainer Details**

- **Endpoint:** `PUT /api/v1/trainer-management/trainer/:cognitoId`
- **Description:** Updates the details of an existing trainer by their Cognito ID.
- **Request Body (JSON):**

    ```json
    {
        "name": "John Updated Doe",          // Optional: Update trainer's name
        "email": "john.updated@example.com", // Optional: Update trainer's email
        "expertise": ["React", "Node.js"],   // Optional: Update list of expertise
        "bio": "Updated bio of the trainer"   // Optional: Update bio
    }
    ```

- **Response (JSON):**

    ```json
    {
        "cognitoId": "60b7d3fd3407b3f1d4f1bb7a",
        "name": "John Updated Doe",
        "email": "john.updated@example.com",
        "expertise": ["React", "Node.js"],
        "bio": "Updated bio of the trainer",
        "trainingIds": [],
        "batchIDs": [],
        "createdAt": "2024-11-05T12:34:56.789Z",
        "updatedAt": "2024-11-06T12:34:56.789Z"
    }
    ```

- **Errors:**
    - `404 Not Found` if the trainer with the specified Cognito ID does not exist.
    - `500 Internal Server Error` if there’s an issue updating the trainer.

---

### 5. **Delete a Trainer**

- **Endpoint:** `DELETE /api/v1/trainer-management/trainer/:id`
- **Description:** Deletes a trainer by their ID.
- **Response (JSON):**

    ```json
    {
        "message": "Trainer deleted successfully"
    }
    ```

- **Errors:**
    - `404 Not Found` if the trainer with the specified ID does not exist.
    - `500 Internal Server Error` if there’s an issue deleting the trainer.

---

### 6. **Assign Training to a Trainer**

- **Endpoint:** `POST /api/v1/trainer-management/trainer/:id`
- **Description:** Assigns a training to a trainer by their ID.
- **Request Body (JSON):**

    ```json
    {
        "trainingId": "60b7d3fd3407b3f1d4f1bb7c"  // Training ID to be assigned (ObjectId)
    }
    ```

- **Response (JSON):**

    ```json
    {
        "cognitoId": "60b7d3fd3407b3f1d4f1bb7a",
        "name": "John Doe",
        "trainingIds": ["60b7d3fd3407b3f1d4f1bb7c"]
    }
    ```

- **Errors:**
    - `404 Not Found` if the trainer or the training does not exist.
    - `500 Internal Server Error` if there’s an issue assigning the training.

---

### 7. **Get Trainers for Dropdown**

- **Endpoint:** `GET /api/v1/trainer-management/getTrainersForDropdown`
- **Description:** Retrieves a list of trainers for use in a dropdown menu (with cognitoId, name, and expertise).
- **Response (JSON):**

    ```json
    [
        {
            "cognitoId": "60b7d3fd3407b3f1d4f1bb7a",
            "name": "John Doe",
            "expertise": ["JavaScript", "Node.js"]
        },
        {
            "cognitoId": "60b7d3fd3407b3f1d4f1bb7b",
            "name": "Jane Smith",
            "expertise": ["Python", "Django"]
        }
    ]
    ```

- **Errors:**
    - `404 Not Found` if no trainers are available.
    - `500 Internal Server Error` if there’s an issue fetching the trainers.

---

## Sample `curl` Commands

Here are a few sample `curl` commands for interacting with the API:

1. **Create a New Trainer:**

    ```bash
    curl -X POST http://localhost:3000/api/v1/trainer-management/trainer \
    -H "Content-Type: application/json" \
    -d '{
        "cognitoId": "60b7d3fd3407b3f1d4f1bb7a",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "expertise": ["JavaScript", "Node.js"],
        "bio": "Experienced software developer"
    }'
    ```

2. **Update Trainer:**

    ```bash
    curl -X PUT http://localhost:3000/api/v1/trainer-management/trainer/60b7d3fd3407b3f1d4f1bb7a \
    -H "Content-Type: application/json" \
    -d '{
        "name": "John Updated Doe",
        "email": "john.updated@example.com",
        "expertise": ["React", "Node.js"]
    }'
    ```

3. **Assign Training to Trainer:**

    ```bash
    curl -
