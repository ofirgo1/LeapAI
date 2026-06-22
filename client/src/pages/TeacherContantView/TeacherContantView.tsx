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

const mockContent = {
    id: '1',
    title: 'סיכום לימודי - חוקי ניוטון',
    subject: 'פיזיקה',
    grade: 'י',
    type: 'סיכום לימודי',
    createdAt: '22/06/2026',
    content: `
חוקי ניוטון הם שלושה חוקים בסיסיים המתארים את הקשר בין כוח, מסה ותנועה.

חוק ראשון:
גוף יתמיד במצבו — במנוחה או בתנועה במהירות קבועה — כל עוד לא פועל עליו כוח חיצוני.

חוק שני:
הכוח שפועל על גוף שווה למסה שלו כפול התאוצה שלו.

F = m · a

חוק שלישי:
לכל פעולה יש תגובה שווה בגודלה והפוכה בכיוונה.
  `,
};

export default function TeacherContentView() {
    const { id } = useParams();
    const navigate = useNavigate();

    console.log(id);

    return (
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
                                {mockContent.type}
                            </Badge>

                            <Badge size="lg" radius="xl" variant="light">
                                {mockContent.subject}
                            </Badge>

                            <Badge size="lg" radius="xl" variant="light">
                                כיתה {mockContent.grade}
                            </Badge>
                        </Group>

                        <Title order={1}>{mockContent.title}</Title>

                        <Text c="dimmed">
                            נוצר בתאריך {mockContent.createdAt}
                        </Text>
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
                            {mockContent.content}
                        </Text>
                    </Stack>
                </Card>
            </Stack>
        </Box>
    );
}
