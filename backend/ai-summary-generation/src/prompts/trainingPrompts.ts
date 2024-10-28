export const generateTrainingSummaryPrompt = (
    department: string,
    trainingType: string,
    duration: string,
    objectives: string
  ): string => {
    return `
      You are an expert in training program development. Based on the following details, generate a concise and compelling summary for a training program:
  
      **Training Details**:
      - **Department**: ${department}
      - **Training Type**: ${trainingType}
      - **Duration**: ${duration}
      - **Objectives**: ${objectives}
  
      Please create a summary that highlights the key aspects of the training program, including its purpose, expected outcomes, and any important notes relevant to the department and manager. The summary should be engaging and informative, suitable for presenting to stakeholders.
    `;
  };
  