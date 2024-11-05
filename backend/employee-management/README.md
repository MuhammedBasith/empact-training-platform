Employee Management API Documentation

Base URL

/api/v1/employee-management

1. Create Employee

POST /api/v1/employee-management/

This endpoint allows you to create a new employee in the system.

Request Body

```json
{
  "cognitoId": "60b7d3fd3407b3f1d4f1bb7a",  // The Cognito user ID (ObjectId)
  "empName": "John Doe",  // Employee's full name
  "empEmail": "john.doe@example.com",  // Employee's email address
  "empAccount": "johndoe123",  // Employee's account/username
  "empSkills": "JavaScript, Node.js, MongoDB",  // Skills of the employee
  "trainingIds": "60b7d3fd3407b3f1d4f1bb7a",  // Associated training ID (ObjectId)
  "department": "Engineering",  // Department the employee belongs to
  "hiredAt": "2024-11-05T00:00:00Z"  // Date of hire (ISO format)
}

```

Response

```json
{
  "_id": "60b7d3fd3407b3f1d4f1bb7a",
  "cognitoId": "60b7d3fd3407b3f1d4f1bb7a",
  "empName": "John Doe",
  "empEmail": "john.doe@example.com",
  "empAccount": "johndoe123",
  "empSkills": "JavaScript, Node.js, MongoDB",
  "trainingIds": "60b7d3fd3407b3f1d4f1bb7a",
  "department": "Engineering",
  "hiredAt": "2024-11-05T00:00:00Z",
  "__v": 0
}

```
2. Get All Employees

GET /api/v1/employee-management/

This endpoint retrieves a list of all employees in the system.

Response

```json
[
  {
    "_id": "60b7d3fd3407b3f1d4f1bb7a",
    "cognitoId": "60b7d3fd3407b3f1d4f1bb7a",
    "empName": "John Doe",
    "empEmail": "john.doe@example.com",
    "empAccount": "johndoe123",
    "empSkills": "JavaScript, Node.js, MongoDB",
    "trainingIds": "60b7d3fd3407b3f1d4f1bb7a",
    "department": "Engineering",
    "hiredAt": "2024-11-05T00:00:00Z"
  },
  {
    "_id": "60b7d3fd3407b3f1d4f1bb7b",
    "cognitoId": "60b7d3fd3407b3f1d4f1bb7b",
    "empName": "Jane Smith",
    "empEmail": "jane.smith@example.com",
    "empAccount": "janesmith456",
    "empSkills": "Python, Django, SQL",
    "trainingIds": "60b7d3fd3407b3f1d4f1bb7b",
    "department": "Engineering",
    "hiredAt": "2024-05-10T00:00:00Z"
  }
]

```
3. Get Employee by Cognito ID

GET /api/v1/employee-management/:cognitoId

This endpoint retrieves an employee by their Cognito user ID.

Parameters

-cognitoId (URL Parameter): The Cognito user ID (ObjectId) of the employee.

Response

```json
{
  "_id": "60b7d3fd3407b3f1d4f1bb7a",
  "cognitoId": "60b7d3fd3407b3f1d4f1bb7a",
  "empName": "John Doe",
  "empEmail": "john.doe@example.com",
  "empAccount": "johndoe123",
  "empSkills": "JavaScript, Node.js, MongoDB",
  "trainingIds": "60b7d3fd3407b3f1d4f1bb7a",
  "department": "Engineering",
  "hiredAt": "2024-11-05T00:00:00Z"
}

```
4. Update Employee Training IDs

PUT /api/v1/employee-management/:cognitoId

This endpoint updates the training IDs associated with an employee.

Parameters

-cognitoId (URL Parameter): The Cognito user ID (ObjectId) of the employee whose training IDs are to be updated.

Request Body
```json
{
  "trainingIds": "60b7d3fd3407b3f1d4f1bb7a"  // New training ID (ObjectId)
}
```
Response
```json
{
  "_id": "60b7d3fd3407b3f1d4f1bb7a",
  "cognitoId": "60b7d3fd3407b3f1d4f1bb7a",
  "empName": "John Doe",
  "empEmail": "john.doe@example.com",
  "empAccount": "johndoe123",
  "empSkills": "JavaScript, Node.js, MongoDB",
  "trainingIds": "60b7d3fd3407b3f1d4f1bb7a",  // Updated training ID
  "department": "Engineering",
  "hiredAt": "2024-11-05T00:00:00Z"
}
````
5. Find Employees by Training ID

GET /api/v1/employee-management/emp/:trainingId

This endpoint retrieves all employees who are associated with a specific training ID.

Parameters

-trainingId (URL Parameter): The training ID (ObjectId) to find employees associated with.

Response

```json
[
  {
    "_id": "60b7d3fd3407b3f1d4f1bb7a",
    "cognitoId": "60b7d3fd3407b3f1d4f1bb7a",
    "empName": "John Doe",
    "empEmail": "john.doe@example.com",
    "empAccount": "johndoe123",
    "empSkills": "JavaScript, Node.js, MongoDB",
    "trainingIds": "60b7d3fd3407b3f1d4f1bb7a",
    "department": "Engineering",
    "hiredAt": "2024-11-05T00:00:00Z"
  }
]

```