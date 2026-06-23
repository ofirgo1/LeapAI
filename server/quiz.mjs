import { GoogleGenAI, Type } from '@google/genai';
import express from 'express';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const app = express();
const PORT = 8000;

app.use(express.json({ limit: '50mb' }));

const QuizSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
    },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
          },
          wrong_answers: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
          correct_answer: {
            type: Type.STRING,
          },
        },
        required: [
          'question',
          'wrong_answers',
          'correct_answer',
        ],
      },
    },
  },
  required: ['title', 'questions'],
};

async function generateQuizQuestions(topic, numOfQuestions, difficulty, lang) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `
Generate a ${numOfQuestions}-question quiz in ${lang}.

Topic:
${topic}

Difficulty:
${difficulty} out of 10.

Return JSON only.

Each question must include:
- question
- wrong_answers
- correct_answer

Rules:
- wrong_answers must contain exactly 3 wrong answers.
- correct_answer must contain the single correct answer.
`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: QuizSchema,
    },
  });

  return JSON.parse(response.text);
}

async function generateSummary(topic, subject, lang) {
const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `
    Generate a summary on ${subject} in ${lang}.
    Topic:
    ${topic}.
    Your response should contain the summary ONLY, and no other prefix or suffix.`
  });
  return response.text;
}



export async function generateQuiz(
  subject,
  topic,
  difficulty,
  numOfQuestions = 10,
  lang = 'Hebrew',
) {
  const quizBase = await generateQuizQuestions(
    topic,
    numOfQuestions,
    difficulty,
    lang,
  );

  const questions = Array.isArray(quizBase.questions) ? quizBase.questions : [];
  
  return {
    subject,
    title: quizBase.title,
    difficulty,
    grade: 'NULL',
    content: questions
      .map((q) => ({
        question: q.question,
        wrong_answers: q.wrong_answers,
        correct_answer: q.correct_answer,
      })),
  };
}

app.post('/generate_quiz', async (req, res) => {
  try {
    const { subject, topic, difficulty, num_of_questions, lang } = req.body;

    if (!subject || !topic || !difficulty) {
      return res.status(400).json({
        error: 'Missing required fields: subject, topic, or difficulty.',
      });
    }

    console.log(
      `[+] Received request to generate a quiz on: ${topic} (${subject})`,
    );

    const quizResult = await generateQuiz(
      subject,
      topic,
      Number(difficulty),
      num_of_questions ? Number(num_of_questions) : 10,
      lang || 'Hebrew',
    );

    return res.status(200).json(quizResult);
  } catch (error) {
    console.error('[-] Error generating quiz inside endpoint:', error);

    return res.status(500).json({
      error: 'An internal server error occurred while generating the quiz.',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

app.post('/generate_summary', async (req, res) => {
  try {
    const { subject, topic, lang } = req.body;
    if (!subject || !topic) {
      return res.status(400).json({
        error: 'Missing required fields: subject or topic.',
      });
    }

    console.log(
      `[+] Received request to generate a summary on: ${topic} (${subject})`,
    );

    const summaryResult = await generateSummary(
      subject,
      topic,
      lang || 'Hebrew',
    );
    console.log('[+] Done! returning result');
    return res.status(200).json({'subject':subject, 'title': subject, 'content': summaryResult});
  } catch (error) {
    console.error('[-] Error generating summary inside endpoint:', error);

    return res.status(500).json({
      error: 'An internal server error occurred while generating the summary.',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});


app.listen(PORT, () => {
  console.log(`[+] Quiz generation API running on http://localhost:${PORT}`);
});
