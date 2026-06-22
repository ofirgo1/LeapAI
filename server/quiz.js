import { GoogleGenAI, Type } from '@google/genai';
import { z } from 'zod';
import * as fs from 'fs';

// Initialize the client. It automatically picks up process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});
// 1. Define custom HTTP Retry boundaries using HttpOptions mapping
const httpConfig = {
    // Note: If configuring specific retry options, adjust according to the JS SDK's FetchOptions/Retry interface.
    // For general timeouts, you can pass a signal or rely on default fetch configurations.
    timeout: 300 * 1000 
};

// 2. Define Zod Schemas (Pydantic equivalents)
const QuizQuestionSchema = z.object({
    question: z.string(),
    image_description: z.string().describe("A description of an image illustration for this question, if required."),
    image_required: z.boolean().describe("Whether an image illustration is required for this question"),
    wrong_answers: z.array(z.string()).length(3).describe("Exactly 3 wrong options"),
    correct_answer: z.string().describe("A correct answer")
});

const QuizSchema = z.object({
    title: z.string(),
    questions: z.array(QuizQuestionSchema)
});

const IdeaSchema = z.object({
    title: z.string().describe('A title summarizing the idea'),
    details: z.string().describe('Extra details on how to implement this idea and some suggestions on how to improve this')
});

const IdeasSchema = z.object({
    ideas: z.array(IdeaSchema)
});


// 3. Core Functions

async function generateQuizQuestions(topic, numOfQuestions, difficulty, lang) {
    const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Generate a ${numOfQuestions}-question quiz in ${lang} on the ${topic}, in a difficulty of ${difficulty} out of 10, where 1 is the most basic, and 10 requires deep understanding of the topic. Utilize diagrams and image descriptions as necessary.`,
        config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: 'application/json',
            responseSchema: QuizSchema,
        }
    });

    return JSON.parse(response.text);
}

async function generateQuizQuestionsV2(topic, numOfQuestions, lang) {
    console.log("[+] Generating using Gemini 2.5");
    const researchResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Research the core principles and common educational examples of ${topic}. Provide a detailed summary of facts.`,
        config: {
            tools: [{ googleSearch: {} }],
        }
    });

    console.log("[+] Step 2: Formatting facts into a structured Hebrew JSON quiz...");
    const quizResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Based strictly on this text, generate a ${numOfQuestions}-question quiz in ${lang}. Utilize diagrams and image descriptions as necessary.\n\nSource Text:\n${researchResponse.text}`,
        config: {
            responseMimeType: 'application/json',
            responseSchema: QuizSchema,
        }
    });

    return JSON.parse(quizResponse.text);
}

async function generateImageInternal(prompt) {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: prompt,
            config: {
                responseModalities: ["IMAGE"],
                // imageConfig: { aspect_ratio: "1:1" }
            }
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        if (part && part.inlineData) {
            // The JS SDK returns base64 data directly inside inlineData.data
            return part.inlineData.data; 
        }
    } catch (e) {
        console.error(e);
        return 'FAILED';
    }
    return 'FAILED';
}

async function generateImage(prompt) {
    const trials = 5;
    for (let i = 0; i < trials; i++) {
        const image = await generateImageInternal(prompt);
        if (image === 'FAILED') {
            console.log('[*] Failed generating image. trying again...');
        } else {
            return image;
        }
    }
    console.log(`[-] Failed generating image after ${trials} trials. Aborting.`);
    return '';
}

function writeToFile(contents, fname) {
    fs.writeFileSync(fname, contents, 'utf-8');
}

async function generateIdeas(subject, details) {
    const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `I want to create a lesson on ${subject}. some details: ${details}. Please think of at least four creative ideas.`,
        config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: 'application/json',
            responseSchema: IdeasSchema,
        }
    });
    return JSON.parse(response.text);
}

async function generateSummary(subject, details) {
    const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Summarize ${subject}. some details that interest me in particular: {details}.`,
        config: {
            tools: [{ googleSearch: {} }]
        }
    });
    return response.text;
}

export async function generateQuiz(subject, topic, difficulty, numOfQuestions = 10, lang = 'Hebrew') {
    const quizBase = await generateQuizQuestions(topic, numOfQuestions, difficulty, lang);
    
    // Debug helper
    // writeToFile(JSON.stringify(quizBase, null, 2), 'raw_quiz_structure.json');
    
    const imagesRequired = quizBase.questions.filter(q => q.image_required).length;
    console.log(`[+] Generated a quiz. Generating ${imagesRequired} image${imagesRequired !== 1 ? "s" : ""}`);
    
    let imagesGenerated = 0;
    for (let i = 0; i < quizBase.questions.length; i++) {
        if (!quizBase.questions[i].image_required) continue;
        
        console.log(`[+] Generating an image (${imagesGenerated + 1} out of ${imagesRequired})`);
        quizBase.questions[i].image_description = await generateImage(quizBase.questions[i].image_description);
        imagesGenerated++;
    }
    
    console.log('[+] Done generating all images!');
    
    return {
        subject: subject,
        title: quizBase.title,
        difficulty: difficulty,
        grade: 'NULL',
        content: quizBase.questions
            .filter(q => !q.image_required || q.image_description.length > 0)
            .map(q => ({
                question: q.question,
                image: q.image_description, // Holds base64 string or blank
                wrong_answers: q.wrong_answers,
                correct_answer: q.correct_answer
            }))
    };
}


import express from 'express';

const app = express();
const PORT = 8000;

// Middleware to parse incoming JSON bodies
app.use(express.json());

/**
 * POST /generate_quiz
 * Expects: subject, topic, difficulty, num_of_questions, lang
 */
app.post('/generate_quiz', async (req, res) => {
    try {
        const { subject, topic, difficulty, num_of_questions, lang } = req.body;

        // Simple validation to ensure everything required is provided
        if (!subject || !topic || !difficulty) {
            return res.status(400).json({ 
                error: "Missing required fields: subject, topic, or difficulty." 
            });
        }

        console.log(`[+] Received request to generate a quiz on: ${topic} (${subject})`);

        // Convert parameters to match your function signature
        const quizResult = await generateQuiz(
            subject, 
            topic, 
            Number(difficulty), // Ensure difficulty is parsed as a number
            num_of_questions ? Number(num_of_questions) : 10, 
            lang || 'Hebrew'
        );

        // Return the exact expected format
        return res.status(200).json(quizResult);

    } catch (error) {
        console.error("[-] Error generating quiz inside endpoint:", error);
        return res.status(500).json({ 
            error: "An internal server error occurred while generating the quiz." 
        });
    }
});

app.listen(PORT, () => {
    console.log(`[+] Quiz generation API running on http://localhost:${PORT}`);
});