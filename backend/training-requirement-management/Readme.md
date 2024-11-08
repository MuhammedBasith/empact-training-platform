### API Documentation Training Requirements Service.

This API allows you to manage training requirements, including creating, updating, retrieving, and deleting training requirements. It also supports integration with various microservices, such as batch management, trainer management, and employee management.

---

#### **Base URL**  
```
http://localhost:3003/api/v1/training-requirements
```

---

### **Routes Overview**

| Method | Endpoint                                          | Description                                                                                 |
|--------|---------------------------------------------------|---------------------------------------------------------------------------------------------|
| GET    | `/`                                               | Retrieve a list of all training requirements.                                               |
| GET    | `/getTrainingRequirement/:cognitoId/:id`          | Retrieve a specific training requirement by `cognitoId` and `id`.                           |
| GET    | `/getTrainingRequirementsByManager/:id`           | Get training requirements under a manager, identified by `cognitoId`.                       |
| GET    | `/getTrainingRequirementUnderAManager/:id`        | Get training requirements for a specific manager by their `id`.                             |
| GET    | `/getTrainingDetails/:trainingId/:cognitoId`      | Get training details along with associated batch details by `trainingId` and `cognitoId`.   |
| GET    | `/getEmpCountById/:id`                            | Get the employee count for a specific training requirement by `id`.                         |
| POST   | `/`                                               | Create a new training requirement.                                                         |
| POST   | `/getTrainingDetailsByIds`                        | Retrieve details for multiple training requirements by their `trainingIds`.                 |
| PUT    | `/confirmRequirement/:requirementId`              | Confirm the status of a training requirement by its `requirementId`.                        |
| PUT    | `/:id/empCount`                                   | Update the employee count for a specific training requirement by `id`.                      |
| PUT    | `/updateBatchIds/:id`                             | Update the batch IDs associated with a specific training requirement by `id`.               |
| DELETE | `/:id`                                            | Delete a specific training requirement by `id`.                                             |

---

### **Training Requirement Schema**

The `TrainingRequirement` schema defines the structure of a training requirement document.

```js
const trainingRequirementSchema = new Schema<ITrainingRequirement>({
    cognitoId: { type: String, ref: 'users', required: true },
    batchIds: { type: [Schema.Types.ObjectId], ref: 'batches', default: null },
    department: { type: String, required: true },
    trainingName: { type: String },
    trainingType: { type: String, required: true },
    duration: { type: String, required: true },
    objectives: { type: String },
    empCount: { type: Number, default: 0 },
    prerequisite: { type: String },
    skills_to_train: { type: String },
    status: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
```

- **cognitoId**: The ID of the manager who created this training requirement (linked to a user in the `users` collection).
- **batchIds**: Array of `ObjectId`s referencing batches in the batch management system.
- **department**: The department that requires the training.
- **trainingName**: The name of the training program.
- **trainingType**: Type of the training (e.g., online, in-person).
- **duration**: Duration of the training (e.g., "2 days", "4 hours").
- **objectives**: Training objectives or goals.
- **empCount**: The number of employees to be trained.
- **prerequisite**: Prerequisite skills for the training.
- **skills_to_train**: The skills that the training aims to teach.
- **status**: Boolean indicating whether the training requirement is confirmed or not.
- **createdAt**: Date when the training requirement was created.
- **updatedAt**: Date when the training requirement was last updated.

---

### **Endpoint Descriptions**

#### **GET /**

**Description**:  
Retrieves a list of all training requirements with basic details such as `cognitoId`, `name`, and `trainingCount`.

**Response Example**:

```json
{
  "trainingRequirements": [
    {
      "cognitoId": "user123",
      "name": "John Doe",
      "trainingCount": 3
    },
    {
      "cognitoId": "user456",
      "name": "Jane Smith",
      "trainingCount": 2
    }
  ]
}
```

---

#### **GET /getTrainingRequirement/:cognitoId/:id**

**Description**:  
Fetches a specific training requirement using the `cognitoId` of the manager and the `id` of the training requirement.

**Parameters**:
- `cognitoId`: The `cognitoId` of the manager who created the training.
- `id`: The unique ID of the training requirement.

**Response Example**:

```json
{
  "cognitoId": "user123",
  "trainingName": "Leadership Training",
  "empCount": 25,
  "skills_to_train": "Leadership, Communication",
  "status": true,
  "createdAt": "2024-04-01T00:00:00.000Z",
  "updatedAt": "2024-04-02T00:00:00.000Z"
}
```

---

#### **GET /getEmpCountById/:id**

**Description**:  
Fetches the employee count for a specific training requirement by its `id`.

**Parameters**:
- `id`: The ID of the training requirement.

**Response Example**:

```json
{
  "trainingRequirementId": "605c72ef153207001fdfd76",
  "empCount": 30,
  "trainingName": "Project Management",
  "duration": "5 days",
  "skills_to_train": "Project Planning, Time Management"
}
```

---

#### **GET /getTrainingRequirementsByManager/:id**

**Description**:  
Retrieves a list of all training requirements created by a specific manager using their `cognitoId`.

**Parameters**:
- `id`: The `cognitoId` of the manager.

**Response Example**:

```json
{
  "success": true,
  "data": [
    {
      "_id": "605c72ef153207001fdfd76",
      "trainingName": "Leadership Training",
      "trainer": { "name": "John Doe" },
      "batchDetails": [
        {
          "batchId": "batch123",
          "batchNumber": "Batch 1",
          "trainer": "John Smith",
          "employeeCount": 10
        }
      ]
    }
  ]
}
```

---

#### **POST /**

**Description**:  
Creates a new training requirement.

**Request Body**:

```json
{
  "cognitoId": "user123",
  "trainingName": "Leadership Training",
  "trainingType": "In-Person",
  "duration": "5 days",
  "department": "HR",
  "objectives": "Develop leadership skills",
  "empCount": 25,
  "prerequisite": "None",
  "skills_to_train": "Leadership, Communication"
}
```

**Response Example**:

```json
{
  "trainingRequirementId": "605c72ef153207001fdfd76",
  "batchIds": null,
  "department": "HR",
  "trainingName": "Leadership Training",
  "trainingType": "In-Person",
  "duration": "5 days",
  "objectives": "Develop leadership skills",
  "empCount": 25,
  "prerequisite": "None",
  "skills_to_train": "Leadership, Communication",
  "status": false,
  "summary": "Training will focus on leadership development."
}
```

---

#### **PUT /confirmRequirement/:requirementId**

**Description**:  
Updates the status of a training requirement (confirmed or not).

**Parameters**:
- `requirementId`: The ID of the training requirement.
- Request Body:
  ```json
  {
    "status": true
  }
  ```

**Response Example**:

```json
{
  "trainingRequirementId": "605c72ef153207001fdfd76",
  "status": true
}
```

---

#### **PUT /:id/empCount**

**Description**:  
Updates the employee count for a specific training requirement.

**Parameters**:
- `id`: The ID of the training requirement.
- Request Body:
  ```json
  {
    "empCount": 35
  }
  ```

**Response Example**:

```json
{
  "trainingRequirementId": "605c72ef153207001fdfd76",
  "empCount": 35
}
```

---

#### **PUT /updateBatchIds/:id**

**Description**:  
Updates the batch IDs associated with a specific training requirement.

**Parameters**:
- `id`: The ID of the training requirement.
- Request Body:
  ```json
  {
    "batchIds": ["605c72ef153207001fdfd76"]
  }
  ```

**Response Example**:

```json
{
  "message": "Batch IDs updated successfully",
  "updatedRequirement": {
    "batchIds": ["605c72ef153207001fdfd76"]
  }
}
```

---

#### **DELETE /:id**

**Description**:  
Deletes a specific training requirement by `id`.

**Parameters**:
- `id

`: The ID of the training requirement.

**Response Example**:

```json
{
  "message": "Training requirement deleted successfully"
}
```

---

### **Error Handling**

Common error responses:

```json
{
  "error": "Invalid cognitoId",
  "message": "The provided cognitoId is not found in the system."
}
```

```json
{
  "error": "Training requirement not found",
  "message": "The training requirement with the given ID does not exist."
}
```

