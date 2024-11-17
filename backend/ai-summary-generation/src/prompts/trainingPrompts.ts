export const generateTrainingSummaryPrompt = (
  department: string,
  trainingName: string,
  trainingType: string,
  duration: string,
  objectives: string,
  prerequisite: string,
  skills_to_train: string
): string => {
  return `
    You are a training program development expert. Based on the following details, generate a comprehensive and detailed summary for a training program that will help the Learning & Development (L&D) team understand the key aspects of the program and plan the necessary arrangements. The summary should include a deeper analysis of the objectives, technologies, skills, and the specific learning outcomes expected from the training.

    **Training Details**:
    - **Department**: ${department}
    - **Training Name**: ${trainingName}
    - **Training Type**: ${trainingType}
    - **Duration**: ${duration}
    - **Objectives**: ${objectives}
    - **Prerequisite**: ${prerequisite}
    - **Skills to train**: ${skills_to_train}

    **Summary Requirements**:
    - Expand upon the provided training details and objectives to give a detailed explanation of what the training aims to achieve.
    - Provide a breakdown of the core skills and technologies that will be taught, highlighting how these skills align with the department’s needs and broader organizational goals.
    - Explain how the training will be structured, considering the duration, training type, and prerequisite knowledge.
    - Elaborate on the specific skills that need to be developed, and how the training will enhance the capabilities of the employees.
    - Identify any potential challenges or considerations related to the prerequisites, duration, or specific skills to be trained.
    - The tone should be professional, detailed, and suitable for internal use by the L&D team. Avoid marketing language; the goal is clarity and in-depth understanding.
    
    Make sure to include all relevant details that will help the L&D team make an informed decision about the training requirements and planning.
  `;
};


export const generateFeedbackSummaryPrompt = (feedbacks: string[]): string => {

  return `
    Below are feedbacks provided by a trainer about an employee's performance in a training:

    ${feedbacks}

    Please generate a concise summary of the feedbacks, highlighting key points of progress, areas of improvement, and overall status of the employee's development.
  `;
};
