# AI Summary Generation Microservice.

### 1. **Overview**

This microservice provides a simple API for generating, editing, and confirming summaries related to training requirements. It uses a generative AI model (likely a service like Google's Gemini) to automatically generate summaries based on provided training requirement data. The microservice stores generated summaries in MongoDB and supports the following operations:

- Generate a summary for a training requirement.
- Retrieve an existing summary.
- Edit an existing summary.
- Confirm the summary as final.

---

### 2. **Setup & Installation**

#### **Prerequisites**

- Node.js (v14 or higher)
- MongoDB instance (local or cloud)
- Access to Google Generative AI or a similar generative AI service (configured via API keys)

#### **Steps to Run the Service**

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/MuhammedBasith/empact-training-platform/ai-summary-microservice.git
   cd ai-summary-microservice
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add the necessary configurations (e.g., for the database and API keys):
   ```bash
   MONGODB_URI=<your_mongo_connection_string>
   GOOGLE_API_KEY=<your_google_api_key>
   ```

4. **Run the Application**:
   ```bash
   npm run start
   ```

   The application will be available at `http://localhost:3004`.

---

### 3. **API Endpoints**

#### **POST** `/api/v1/summaries/generate`

Generate a new summary for a training requirement.

**Request**:
- **Body** (JSON):
   ```json
   {
     "trainingRequirementId": "<ObjectId>",
     "department": "HR",
     "trainingName": "Leadership Training",
     "trainingType": "Online",
     "duration": "2 hours",
     "objectives": ["Improve communication", "Enhance decision making"],
     "prerequisite": "Basic managerial skills",
     "skills_to_train": ["Leadership", "Communication"]
   }
   ```

**Response**:
- **Status**: `201 Created`
- **Body** (JSON):
   ```json
   {
     "trainingRequirementId": "<ObjectId>",
     "summary": "Generated summary content here...",
     "confirmed": false,
     "generatedAt": "2024-11-05T00:00:00.000Z",
     "_id": "<SummaryId>"
   }
   ```

**Errors**:
- `500 Internal Server Error`: If there is an issue with the AI service or database.

---

#### **GET** `/api/v1/summaries/:trainingRequirementId`

Retrieve an existing summary by `trainingRequirementId`.

**Request**:
- **Params**: `trainingRequirementId` (required)

**Response**:
- **Status**: `200 OK`
- **Body** (JSON):
   ```json
   {
     "trainingRequirementId": "<ObjectId>",
     "summary": "Generated summary content here...",
     "editedSummary": "Edited summary content here...",
     "confirmed": false,
     "generatedAt": "2024-11-05T00:00:00.000Z",
     "_id": "<SummaryId>"
   }
   ```

**Errors**:
- `404 Not Found`: If the summary is not found.
- `500 Internal Server Error`: General error.

---

#### **PUT** `/api/v1/summaries/:requirementId/edit`

Edit an existing summary.

**Request**:
- **Params**: `requirementId` (required)
- **Body** (JSON):
   ```json
   {
     "editedSummary": "Updated summary content here..."
   }
   ```

**Response**:
- **Status**: `200 OK`
- **Body** (JSON):
   ```json
   {
     "trainingRequirementId": "<ObjectId>",
     "summary": "Generated summary content here...",
     "editedSummary": "Updated summary content here...",
     "confirmed": false,
     "generatedAt": "2024-11-05T00:00:00.000Z",
     "_id": "<SummaryId>"
   }
   ```

**Errors**:
- `404 Not Found`: If the summary is not found.
- `500 Internal Server Error`: General error.

---

#### **POST** `/api/v1/summaries/:requirementId/confirm`

Confirm the generated summary as final.

**Request**:
- **Params**: `requirementId` (required)
- **Body** (JSON):
   ```json
   {
     "confirmed": true
   }
   ```

**Response**:
- **Status**: `200 OK`
- **Body** (JSON):
   ```json
   {
     "trainingRequirementId": "<ObjectId>",
     "summary": "Generated summary content here...",
     "editedSummary": "Edited summary content here...",
     "confirmed": true,
     "generatedAt": "2024-11-05T00:00:00.000Z",
     "_id": "<SummaryId>"
   }
   ```

**Errors**:
- `404 Not Found`: If the summary is not found.
- `500 Internal Server Error`: General error.

---

### 4. **Dependencies**

- **Express**: Web framework for Node.js.
- **Mongoose**: MongoDB object modeling.
- **Axios**: HTTP client to make requests to external services (e.g., the generative AI model).
- **dotenv**: Loads environment variables from a `.env` file.
- **Google Generative AI SDK** (`@google/generative-ai`): Used to interact with Google's generative AI services for summary generation.

---

### 5. **Data Models**

#### **Summary Model (Mongoose)**

The `Summary` model defines the schema for the generated training summaries in MongoDB:

### Data Models

#### **Summary Model (Mongoose)**

The `Summary` model defines the schema for the generated training summaries in MongoDB:

```ts
const SummarySchema: Schema = new Schema({
  trainingRequirementId: { type: Schema.Types.ObjectId, ref: 'trainingRequirements', required: true },
  summary: { type: String, required: true },
  editedSummary: { type: String },
  confirmed: { type: Boolean, default: false },
  generatedAt: { type: Date, default: Date.now },
});
```

- **`trainingRequirementId`**: A reference to the related training requirement in the system.
- **`summary`**: The automatically generated summary content.
- **`editedSummary`**: An optional field for a manually edited version of the summary.
- **`confirmed`**: A flag indicating whether the summary has been confirmed as final.
- **`generatedAt`**: A timestamp of when the summary was generated.

This model is used to store and manage summaries of training requirements in the database.


### 6. **Environment Variables**

Make sure to define the following environment variables in a `.env` file:

```bash
MONGODB_URI=mongodb://localhost:27017/your-db
GOOGLE_API_KEY=<your_google_api_key>
```

---

### Conclusion

This documentation provides a comprehensive guide to using and contributing to the AI Summary microservice. Make sure to follow the setup instructions and use the API endpoints for managing training requirement summaries effectively.
