import {
    Badge,
    Box,
    Button,
    Card,
    Divider,
    Group,
    Image,
    Loader,
    Paper,
    Progress,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Content, getContantById } from '../../../api/contantApi';
import { setResults } from '../../../api/resultsApi';

interface QuizQuestion {
    image: string;
    question: string;
    wrong_answers: string[];
    correct_answer: string;
}

type UserAnswer = {
    questionIndex: number;
    answer: string;
    correct: boolean;
};

export default function Quiz() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState<Content | null>(null);
    const [current, setCurrent] = useState(0);

    const [selected, setSelected] = useState<string | null>(null);
    const [answers, setAnswers] = useState<string[]>([]);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [score, setScore] = useState(0);

    const [submitting, setSubmitting] = useState(false);

    const questions: QuizQuestion[] =
        Array.isArray(content?.content) ? content.content : [];
    const question = questions[current];

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoading(true);

                const item = await getContantById(id!);
                setContent(item);
            } catch (error) {
                console.error('Error fetching content:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [id]);

    useEffect(() => {
        if (!question) return;

        const shuffled = [
            question.correct_answer,
            ...question.wrong_answers,
        ].sort(() => Math.random() - 0.5);

        setAnswers(shuffled);
    }, [question]);

    const handleSelect = (answer: string) => {
        if (selected) return;

        setSelected(answer);

        const isCorrect =
            answer.trim() === question.correct_answer.trim();

        if (isCorrect) setScore((s) => s + 1);

        setUserAnswers((prev) => [
            ...prev,
            {
                questionIndex: current,
                answer,
                correct: isCorrect,
            },
        ]);
    };

    const next = () => {
        setSelected(null);
        setCurrent((c) => c + 1);
    };

    const finished =
        !loading &&
        content !== null &&
        questions.length > 0 &&
        current >= questions.length;

    const getColor = (answer: string) => {
        if (!selected) return 'blue';

        const isCorrect =
            answer.trim() === question.correct_answer.trim();

        const isSelected = answer === selected;

        if (isCorrect) return 'green';
        if (isSelected && !isCorrect) return 'red';
        return 'gray';
    };

    const handleSubmitResults = async () => {
        try {
            setSubmitting(true);

            await setResults({
                outputId: id!,
                studentName: localStorage.getItem('user') ?? 'Unknown', 
                score,
                answers: userAnswers,
            });

            navigate('/student/contents');
        } catch (error) {
            console.error('Failed to submit results:', error);
        } finally {
            setSubmitting(false);
        }
    };

    // ---------------- REVIEW SCREEN ----------------
    if (finished) {
        return (
            <Box dir="rtl" mih="100vh" bg="#f6f7fb" p="xl">
                <Stack gap="xl">
                    <Title order={1}>סיימת את הבוחן 🎉</Title>

                    <Text size="lg">
                        ניקוד: {score} / {questions.length}
                    </Text>

                    <Group>
                        <Button onClick={() => navigate('/student/contents')}>
                            חזרה לתכנים
                        </Button>

                        <Button
                            loading={submitting}
                            onClick={handleSubmitResults}
                        >
                            שלח תוצאות
                        </Button>
                    </Group>

                    <Divider />

                    <Title order={2}>סקירת תשובות</Title>

                    {questions.map((q, i) => {
                        const userAnswer = userAnswers.find(
                            (a) => a.questionIndex === i
                        );

                        return (
                            <Card key={i} withBorder p="md">
                                <Stack>
                                    <Text fw={700}>
                                        {i + 1}. {q.question}
                                    </Text>

                                    <Text
                                        c={
                                            userAnswer?.answer ===
                                            q.correct_answer
                                                ? 'green'
                                                : 'red'
                                        }
                                    >
                                        התשובה שלך:{' '}
                                        {userAnswer?.answer || 'לא נענה'}
                                    </Text>

                                    <Text c="green">
                                        תשובה נכונה: {q.correct_answer}
                                    </Text>
                                </Stack>
                            </Card>
                        );
                    })}
                </Stack>
            </Box>
        );
    }
    if (loading) {
        return (
            <Box
                dir="rtl"
                mih="100vh"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Stack align="center" gap="md">
                    <Loader size="lg" />
                    <Text size="lg">טוען שאלות...</Text>
                </Stack>
            </Box>
        );
    }
    // ---------------- QUIZ SCREEN ----------------
    return (
        <Box dir="rtl" mih="100vh" bg="#f6f7fb" p="xl">
            <Stack gap="xl">
                {/* HEADER WITH BADGES */}
                <Paper
                    radius={28}
                    p={{ base: 'lg', md: 'xl' }}
                    style={{
                        background:
                            'linear-gradient(135deg, #ecfeff 0%, #eef2ff 45%, #faf5ff 100%)',
                        border: '1px solid rgba(99,102,241,0.16)',
                    }}
                >
                    <Stack gap="md">
                        <Group>
                            <Badge
                                size="lg"
                                radius="xl"
                                variant="gradient"
                                gradient={{ from: 'cyan', to: 'violet' }}
                            >
                                בוחן
                            </Badge>

                            <Badge size="lg" radius="xl" variant="light">
                                {content?.subject}
                            </Badge>

                            <Badge size="lg" radius="xl" variant="light">
                                כיתה {content?.grade}
                            </Badge>
                        </Group>

                        <Title order={1}>{content?.title}</Title>

                        <Text c="dimmed">
                            {content?.createdAt
                                ? new Date(
                                      content.createdAt
                                  ).toLocaleDateString()
                                : 'תאריך לא זמין'}
                        </Text>
                    </Stack>
                </Paper>

                {/* QUESTION CARD */}
                <Card withBorder p="xl" radius={28}>
                    <Stack>
                        <Group justify="space-between">
                            <Text fw={600}>
                                שאלה {current + 1} מתוך {questions.length}
                            </Text>

                            <Text fw={600}>ניקוד: {score}</Text>
                        </Group>

                        <Progress
                            value={
                                ((current + 1) / questions.length) * 100
                            }
                        />

                        <Divider />

                        {question?.image && (
                            <Image src={question.image} radius="md" />
                        )}

                        <Title order={3}>
                            {question?.question}
                        </Title>

                        <Stack>
                            {answers.map((a) => (
                                <Button
                                    key={a}
                                    fullWidth
                                    size="lg"
                                    onClick={() => handleSelect(a)}
                                    color={getColor(a)}
                                >
                                    {a}
                                </Button>
                            ))}
                        </Stack>

                        {selected && (
                            <Button onClick={next}>
                                {current === questions.length - 1
                                    ? 'סיום'
                                    : 'שאלה הבאה'}
                            </Button>
                        )}
                    </Stack>
                </Card>
            </Stack>
        </Box>
    );
}