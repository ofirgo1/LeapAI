import {
    Badge,
    Box,
    Button,
    Card,
    Divider,
    Group,
    Paper,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { getContantById } from '../../api/contantApi';
import { useEffect, useState } from 'react';

interface Question {
    question: string;
    correct_answer: string;
    wrong_answers?: string[];
}

export default function Quiz() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [mockQuestions, setMockQuestions] = useState<Question[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const questions = await getContantById(id!);
                setMockQuestions(questions.content);
            } catch (error) {
                console.error('Error fetching content:', error);
            }
        };

        fetchData();
    }, [id]);

    return (
        <Box dir="rtl" mih="100vh" bg="#f6f7fb" p={{ base: 'md', md: 'xl' }}>
            <Stack gap="xl">
                <Paper
                    radius={28}
                    p={{ base: 'lg', md: 'xl' }}
                    style={{
                        background:
                            'linear-gradient(135deg, #ecfeff 0%, #eef2ff 45%, #faf5ff 100%)',
                        border: '1px solid rgba(99,102,241,0.16)',
                    }}
                >
                    <Group justify="space-between" align="center">
                        <Box>
                            <Badge
                                size="lg"
                                radius="xl"
                                variant="gradient"
                                gradient={{ from: 'cyan', to: 'violet' }}
                            >
                                צפייה למורה
                            </Badge>

                            <Title mt="md" order={1}>
                                שאלות ותשובות נכונות
                            </Title>

                            <Text c="dimmed" mt="xs" size="lg">
                                כאן ניתן לראות את כל השאלות שנוצרו ואת התשובה
                                הנכונה לכל שאלה.
                            </Text>
                        </Box>

                        <Button
                            radius="xl"
                            variant="white"
                            onClick={() => navigate('/teacher/contents')}
                        >
                            חזרה לתכנים
                        </Button>
                    </Group>
                </Paper>

                <Paper
                    radius={28}
                    p={{ base: 'lg', md: 'xl' }}
                    shadow="xs"
                    withBorder
                >
                    <Stack gap="lg">
                        <Box>
                            <Title order={2}>רשימת השאלות</Title>
                            <Text c="dimmed" mt={4}>
                                סך הכל {mockQuestions.length} שאלות.
                            </Text>
                        </Box>

                        <Divider />

                        {mockQuestions.map((question, index) => (
                            <Card key={index} radius="lg" withBorder p="lg">
                                <Stack gap="sm">
                                    <Group justify="space-between">
                                        <Badge radius="xl" variant="light">
                                            שאלה {index + 1}
                                        </Badge>
                                    </Group>

                                    <Text fw={700} size="lg">
                                        {question.question}
                                    </Text>

                                    <Box>
                                        <Text size="sm" c="dimmed">
                                            תשובה נכונה
                                        </Text>

                                        <Text fw={700} c="green" size="md">
                                            {question.correct_answer}
                                        </Text>
                                    </Box>

                                    {question.wrong_answers &&
                                        question.wrong_answers.length > 0 && (
                                            <Box>
                                                <Text size="sm" c="dimmed">
                                                    תשובות שגויות
                                                </Text>

                                                <Stack gap={4} mt={4}>
                                                    {question.wrong_answers.map(
                                                        (
                                                            answer,
                                                            answerIndex,
                                                        ) => (
                                                            <Text
                                                                key={
                                                                    answerIndex
                                                                }
                                                                size="sm"
                                                            >
                                                                • {answer}
                                                            </Text>
                                                        ),
                                                    )}
                                                </Stack>
                                            </Box>
                                        )}
                                </Stack>
                            </Card>
                        ))}
                    </Stack>
                </Paper>
            </Stack>
        </Box>
    );
}
