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
import { useEffect, useState } from 'react';
import { Content, getContantById } from '../../../api/contantApi';

export default function StudentContentView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState<Content | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const items = await getContantById(id!);
                setContent(items);
            } catch (error) {
                console.error('Error fetching content:', error);
            }
        };

        fetchContent();
    }, [id]);
    console.log(content?content.title:null);

    return (
        <Box dir="rtl" mih="100vh" bg="#f6f7fb" p={{ base: 'md', md: 'xl' }}>
            <Stack gap="xl">
                <Group justify="space-between">
                    <Button
                        variant="subtle"
                        onClick={() => navigate('/student/contents')}
                    >
                        חזרה לתכנים
                    </Button>

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
                                {content?.type}
                            </Badge>

                            <Badge size="lg" radius="xl" variant="light">
                                {content?.subject}
                            </Badge>

                            <Badge size="lg" radius="xl" variant="light">
                                כיתה {content?.grade}
                            </Badge>
                        </Group>

                        <Title order={1}>{content?.title}</Title>

                        <Text c="dimmed"> {content?.createdAt ? new Date(content.createdAt).toLocaleDateString() : 'תאריך לא זמין'}</Text>
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

                        <Text
                            style={{
                                whiteSpace: 'pre-line',
                                lineHeight: 1.9,
                                fontSize: '1.05rem',
                            }}
                        >
                            {content?.content}
                        </Text>
                    </Stack>
                </Card>
            </Stack>
        </Box>
    );
}
