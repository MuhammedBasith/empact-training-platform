# Employee Management API

## Overview

The **Employee Management API** is part of a larger system designed to manage employee data within a company. This API handles employee creation, retrieval, and updates, including linking employees to training sessions by their respective training IDs.

### Key Features:
- **Create Employee**: Allows for the creation of new employee records.
- **Get All Employees**: Retrieves a list of all employees in the system.
- **Get Employee by Cognito ID**: Fetches details of an employee by their Cognito ID.
- **Update Employee Training IDs**: Updates the training sessions an employee is associated with.
- **Find Employees by Training ID**: Finds and lists employees who are assigned to a specific training program.

---
### 2. **Setup & Installation**

#### **Prerequisites**

- Node.js (v14 or higher)
- MongoDB instance (local or cloud)

#### **Steps to Run the Service**

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/MuhammedBasith/empact-training-platform/employee-management.git
   cd employee-management
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Application**:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3006`.


## Endpoints Overview

### 1. **Create Employee**

- **Endpoint**: `POST /api/v1/employee-management`
- **Description**: Creates a new employee record in the system.
- **Request Body**:
    ```json
    {
        "cognitoId": "60b7d3fd3407b3f1d4f1bb7a",  // Cognito user ID
        "empName": "John Doe",                    // Employee's name
        "empEmail": "john.doe@example.com",        // Employee's email
        "empAccount": "jdoe123",                   // Employee account identifier
        "empSkills": "JavaScript, Node.js",        // Skills of the employee
        "trainingIds": "60b7d3fd3407b3f1d4f1bb7b", // Linked training IDs (optional)
        "department": "Engineering",               // Department of the employee
        "hiredAt": "2024-11-05T12:34:56.789Z"     // Hiring date (ISO string)
    }
    ```
- **Response**:
    ```json
    {
        "cognitoId": "60b7d3fd3407b3f1d4f1bb7a",
        "empName": "John Doe",
        "empEmail": "john.doe@example.com",
        "empAccount": "jdoe123",
        "empSkills": "JavaScript, Node.js",
        "trainingIds": "60b7d3fd3407b3f1d4f1bb7b",
        "department": "Engineering",
        "hiredAt": "2024-11-05T12:34:56.789Z"
    }
    ```
- **Errors**:
    - `500 Internal Server Error`: Error creating the employee.

---

### 2. **Get All Employees**

- **Endpoint**: `GET /api/v1/employee-management`
- **Description**: Retrieves a list of all employees in the system.
- **Response**:
    ```json
    [
        {
            "cognitoId": "60b7d3fd3407b3f1d4f1bb7a",
            "empName": "John Doe",
            "empEmail": "john.doe@example.com",
            "empAccount": "jdoe123",
            "empSkills": "JavaScript, Node.js",
            "trainingIds": "60b7d3fd3407b3f1d4f1bb7b",
            "department": "Engineering",
            "hiredAt": "2024-11-05T12:34:56.789Z"
        },
        {
            "cognitoId": "60b7d3fd3407b3f1d4f1bb7b",
            "empName": "Jane Smith",
            "empEmail": "jane.smith@example.com",
            "empAccount": "jsmith456",
            "empSkills": "Python, Django",
            "trainingIds": "60b7d3fd3407b3f1d4f1bb7c",
            "department": "Backend Development",
            "hiredAt": "2024-11-10T10:15:42.123Z"
        }
    ]
    ```
- **Errors**:
    - `500 Internal Server Error`: Error retrieving the list of employees.

---

### 3. **Get Employee by Cognito ID**

- **Endpoint**: `GET /api/v1/employee-management/:cognitoId`
- **Description**: Retrieves the details of a specific employee based on their Cognito ID.
- **Response**:
    ```json
    {
        "cognitoId": "60b7d3fd3407b3f1d4f1bb7a",
        "empName": "John Doe",
        "empEmail": "john.doe@example.com",
        "empAccount": "jdoe123",
        "empSkills": "JavaScript, Node.js",
        "trainingIds": "60b7d3fd3407b3f1d4f1bb7b",
        "department": "Engineering",
        "hiredAt": "2024-11-05T12:34:56.789Z"
    }
    ```
- **Errors**:
    - `404 Not Found`: Employee with the specified Cognito ID not found.
    - `500 Internal Server Error`: Error retrieving the employee details.

---

### 4. **Update Employee Training IDs**

- **Endpoint**: `PUT /api/v1/employee-management/:cognitoId`
- **Description**: Updates the training session IDs assigned to a specific employee.
- **Request Body**:
    ```json
    {
        "trainingIds": "60b7d3fd3407b3f1d4f1bb7b"  // Training ID to be assigned
    }
    ```
- **Response**:
    ```json
    {
        "cognitoId": "60b7d3fd3407b3f1d4f1bb7a",
        "empName": "John Doe",
        "empEmail": "john.doe@example.com",
        "empAccount": "jdoe123",
        "empSkills": "JavaScript, Node.js",
        "trainingIds": "60b7d3fd3407b3f1d4f1bb7b",
        "department": "Engineering",
        "hiredAt": "2024-11-05T12:34:56.789Z"
    }
    ```
- **Errors**:
    - `404 Not Found`: Employee with the specified Cognito ID not found.
    - `400 Bad Request`: Invalid training ID format.
    - `500 Internal Server Error`: Error updating the training IDs.

---

### 5. **Find Employees by Training ID**

- **Endpoint**: `GET /api/v1/employee-management/emp/:trainingId`
- **Description**: Finds all employees who are assigned to a specific training session by its ID.
- **Response**:
    ```json
    [
        {
            "cognitoId": "60b7d3fd3407b3f1d4f1bb7a",
            "empName": "John Doe",
            "empEmail": "john.doe@example.com",
            "empAccount": "jdoe123",
            "empSkills": "JavaScript, Node.js",
            "trainingIds": "60b7d3fd3407b3f1d4f1bb7b",
            "department": "Engineering",
            "hiredAt": "2024-11-05T12:34:56.789Z"
        }
    ]
    ```
- **Errors**:
    - `400 Bad Request`: Invalid training ID format.
    - `404 Not Found`: No employees found with the specified training ID.
    - `500 Internal Server Error`: Error retrieving employees.

---

## Data Models

### Employee Model (`IEmployeeManagement`)

Each employee in the system has the following fields:

- **cognitoId**: The unique Cognito ID of the employee.
- **empName**: The full name of the employee.
- **empEmail**: The email address of the employee.
- **empAccount**: The employee’s account identifier (e.g., username).
- **empSkills**: A comma-separated list of the employee's skills.
- **trainingIds**: A list of training session IDs the employee is enrolled in.
- **department**: The department where the employee works.
- **hiredAt**: The date and time the employee was hired.

---
