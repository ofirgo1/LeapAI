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
          image_description: {
            type: Type.STRING,
          },
          image_required: {
            type: Type.BOOLEAN,
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
          'image_description',
          'image_required',
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
- image_description
- image_required
- wrong_answers
- correct_answer

Rules:
- wrong_answers must contain exactly 3 wrong answers.
- correct_answer must contain the single correct answer.
- If no image is needed, set image_required to false and image_description to an empty string.
- If an image is needed, set image_required to true and image_description to a short visual prompt.
`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: QuizSchema,
    },
  });

  return JSON.parse(response.text);
}

async function generateImageInternal(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
      config: {
        responseModalities: ['IMAGE'],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];

    if (part && part.inlineData) {
      return part.inlineData.data;
    }

    return 'FAILED';
  } catch (error) {
    console.error('[-] Image generation failed:', error);
    return 'FAILED';
  }
}

async function generateImage(prompt) {
  const trials = 3;

  // for (let i = 0; i < trials; i++) {
  //   const image = await generateImageInternal(prompt);

  //   if (image === 'FAILED') {
  //     console.log('[*] Failed generating image. Trying again...');
  //   } else {
  //     return image;
  //   }
  // }

  console.log(`[-] Failed generating image after ${trials} trials.`);
  return prompt;
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

  const imagesRequired = questions.filter((q) => q.image_required).length;

  console.log(
    `[+] Generated a quiz. Generating ${imagesRequired} image${
      imagesRequired !== 1 ? 's' : ''
    }`,
  );

  let imagesGenerated = 0;

  for (let i = 0; i < questions.length; i++) {
    if (!questions[i].image_required) {
      questions[i].image_description = '';
      continue;
    }

    console.log(
      `[+] Generating an image (${imagesGenerated + 1} out of ${imagesRequired})`,
    );

    questions[i].image_description = await generateImage(
      questions[i].image_description,
    );

    imagesGenerated++;
  }

  console.log('[+] Done generating all images!');

  return {
    subject,
    title: quizBase.title,
    difficulty,
    grade: 'NULL',
    content: questions
      .filter((q) => !q.image_required || q.image_description.length > 0)
      .map((q) => ({
        question: q.question,
        image: q.image_description || '',
        wrong_answers: q.wrong_answers,
        correct_answer: q.correct_answe,
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

app.listen(PORT, () => {
  console.log(`[+] Quiz generation API running on http://localhost:${PORT}`);
});
