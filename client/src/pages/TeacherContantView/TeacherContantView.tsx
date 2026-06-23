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
import { Content, getContantById } from '../../api/contantApi';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';

export default function TeacherContentView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState<Content | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const items = await getContantById(id!);
                console.log(items);
                setContent(items);
            } catch (error) {
                console.error('Error fetching content:', error);
            }
        };

        fetchContent();
    }, [id]);

    return content ? (
        <Box dir="rtl" mih="100vh" bg="#f6f7fb" p={{ base: 'md', md: 'xl' }}>
            <Stack gap="xl">
                <Group justify="space-between">
                    <Button
                        variant="subtle"
                        onClick={() => navigate('/teacher/contents')}
                    >
                        חזרה לתכנים
                    </Button>

                    <Text c="dimmed" size="sm">
                        מזהה תוכן: {id}
                    </Text>
                </Group>

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
                                {content.type}
                            </Badge>

                            <Badge size="lg" radius="xl" variant="light">
                                {content.subject}
                            </Badge>

                            <Badge size="lg" radius="xl" variant="light">
                                כיתה {content.grade}
                            </Badge>
                        </Group>

                        <Title order={1}>{content.title}</Title>

                        <Text c="dimmed">נוצר בתאריך {content.createdAt}</Text>
                    </Stack>
                </Paper>

                <Card
                    radius={28}
                    p={{ base: 'lg', md: 'xl' }}
                    shadow="xs"
                    withBorder
                >
                    <Stack>
                        <Group justify="space-between">
                            <Title order={2}>תוכן</Title>

                            <Button radius="xl" variant="light">
                                שיתוף
                            </Button>
                        </Group>

                        <Divider />

                        {/* We map the standard paragraph output to Mantine's <Text> component
                          to safely retain your structural typography styling.
                        */}
                        <Markdown
                            components={{
                                p: ({ children }) => (
                                    <Text
                                        style={{
                                            lineHeight: 1.9,
                                            fontSize: '1.05rem',
                                            marginBottom: '1rem',
                                        }}
                                    >
                                        {children}
                                    </Text>
                                ),
                            }}
                        >
                            {content.content}
                        </Markdown>
                    </Stack>
                </Card>
            </Stack>
        </Box>
    ) : (
        <Box dir="rtl" mih="100vh" bg="#f6f7fb" p="xl">
            <Text>טוען תוכן...</Text>
        </Box>
    );
}