// client/src/pages/Student/StudentQuiz.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Card, Radio, Stack, Text, Title, Paper, Group, Alert } from '@mantine/core';
import { getContantById } from '../../api/contantApi';
import { apiClient } from '../../api/apiClient';

interface BackendQuestion {
    question: string;
    correct_answer: string;
    wrong_answers?: string[];
}

interface ShuffledQuestion {
    question: string;
    correctAnswer: string;
    options: string[];
}

export default function StudentQuiz() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<ShuffledQuestion[]>([]);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const fetchAndShuffleQuiz = async () => {
            try {
                const material = await getContantById(id!);
                // content is returned parsed or as a stringified JSON depending on your Axios configuration
                const rawQuestions: BackendQuestion[] = typeof material.content === 'string' 
                    ? JSON.parse(material.content) 
                    : material.content;

                const prepared = rawQuestions.map((q) => {
                    const allOptions = [q.correct_answer, ...(q.wrong_answers || [])];
                    // Fisher-Yates Shuffle
                    for (let i = allOptions.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
                    }
                    return {
                        question: q.question,
                        correctAnswer: q.correct_answer,
                        options: allOptions,
                    };
                });
                setQuestions(prepared);
            } catch (error) {
                console.error('Error fetching quiz content:', error);
            }
        };

        fetchAndShuffleQuiz();
    }, [id]);

    const handleSubmit = async () => {
        let correctCount = 0;
        const answersPayload = questions.map((q, index) => {
            const studentAnswer = answers[index] || '';
            const isCorrect = studentAnswer === q.correctAnswer;
            if (isCorrect) correctCount++;
            
            return {
                question: q.question,
                studentAnswer,
                correctAnswer: q.correctAnswer,
                isCorrect
            };
        });

        const calculatedScore = Math.round((correctCount / questions.length) * 100);
        setScore(calculatedScore);
        setSubmitted(true);

        try {
            // Match backend expectations from AppController Post('results')
            await apiClient.post('/results', {
                outputId: id, // Mapping material ID as the POC target identifier
                studentName: JSON.parse(localStorage.getItem('user') || '{}').name || 'Unknown',
                studentEmail: JSON.parse(localStorage.getItem('user') || '{}').email || 'Unknown',
                score: calculatedScore,
                answers: answersPayload,
            });
        } catch (e) {
            console.error('Failed to save score on server', e);
        }
    };

    return (
        <Box dir="rtl" mih="100vh" bg="#f6f7fb" p="xl">
            <Stack gap="xl" maxw={800} style={{ margin: '0 auto' }}>
                <Paper p="xl" radius="lg" withBorder>
                    <Title order={1}>מענה על בוחן תרגול</Title>
                    <Text c="dimmed">אנא ענה על כל השאלות ובסיום לחץ על כפתור ההגשה.</Text>
                </Paper>

                {submitted && (
                    <Alert color={score >= 60 ? 'green' : 'red'} title="הבוחן הוגש בהצלחה!" radius="md">
                        <Text size="lg" fw={700}>הציון שלך: {score} / 100</Text>
                    </Alert>
                )}

                {questions.map((q, qIndex) => (
                    <Card key={qIndex} radius="lg" withBorder padding="lg">
                        <Stack gap="sm">
                            <Text fw={700} size="lg">{qIndex + 1}. {q.question}</Text>
                            
                            <Radio.Group
                                value={answers[qIndex] || ''}
                                onChange={(val) => !submitted && setAnswers({ ...answers, [qIndex]: val })}
                            >
                                <Stack gap="xs" mt="sm">
                                    {q.options.map((option, oIndex) => {
                                        let optionBg = 'transparent';
                                        if (submitted) {
                                            if (option === q.correctAnswer) {
                                                optionBg = '#f0fdf4'; // Light green highlights correct answer
                                            } else if (answers[qIndex] === option) {
                                                optionBg = '#fef2f2'; // Light red highlights selected wrong answer
                                            }
                                        }

                                        return (
                                            <Box key={oIndex} p="xs" style={{ borderRadius: '8px', backgroundColor: optionBg }}>
                                                <Radio 
                                                    value={option} 
                                                    label={option} 
                                                    disabled={submitted}
                                                />
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            </Radio.Group>
                        </Stack>
                    </Card>
                ))}

                <Group justify="space-between">
                    {!submitted ? (
                        <Button size="lg" onClick={handleSubmit} disabled={Object.keys(answers).length < questions.length}>
                            הגש תשובות
                        </Button>
                    ) : (
                        <Button variant="light" size="lg" onClick={() => navigate('/student')}>
                            חזרה למסך הבית
                        </Button>
                    )}
                </Group>
            </Stack>
        </Box>
    );
}