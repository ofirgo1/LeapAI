export type CreateContentPayload = {
  type: string;
  title: string;
  teacherEmail: string | null;
  grade: string;
  content: {
    subject: string;
    difficulty: string;
    prompt: string;
    fileName: string | null;
  };
};

export type AiQuestion = {
  question: string;
  image: string;
  wrong_answers: string[];
  correct_answer: string;
};

export type AiQuizResult = {
  subject: string;
  title: string;
  difficulty: string | number;
  grade: string;
  content: AiQuestion[];
};


export type AiSummaryResult = {
  subject: string;
  title: string;
  content: string;
};

export async function generateQuizFromAi(
  payload: CreateContentPayload,
): Promise<AiQuizResult> {
  const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  const topic = `${payload.title}\n${payload.content.prompt}`;

  const response = await fetch(`${aiServiceUrl}/generate_quiz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject: payload.content.subject,
      topic,
      difficulty: payload.content.difficulty,
      num_of_questions: 10,
      lang: 'Hebrew',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI service error: ${errorText}`);
  }

  const data = (await response.json()) as AiQuizResult;

  if (!data.subject || !data.title || !Array.isArray(data.content)) {
    throw new Error('AI response structure is invalid');
  }

  return data;
}

export async function generateSummaryFromAi(
  payload: CreateContentPayload,
): Promise<AiSummaryResult> {
  const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  const topic = `${payload.title}\n${payload.content.prompt}`;

  const response = await fetch(`${aiServiceUrl}/generate_summary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject: payload.content.subject,
      topic,
      lang: 'Hebrew',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI service error: ${errorText}`);
  }

  const data = (await response.json()) as AiSummaryResult;

  if (!data.subject || !data.title || !data.content) {
    throw new Error('AI response structure is invalid');
  }

  return data;
}
