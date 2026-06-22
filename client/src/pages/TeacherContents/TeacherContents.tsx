import {
    Badge,
    Box,
    Button,
    Card,
    Group,
    Paper,
    SegmentedControl,
    SimpleGrid,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const learningMaterials = [
    {
        id: '1',
        title: 'סיכום לימודי - חוקי ניוטון',
        subject: 'פיזיקה',
        grade: 'י',
        type: 'סיכום לימודי',
        createdAt: '22/06/2026',
    },
    {
        id: '2',
        title: 'משימת בית - משוואות ריבועיות',
        subject: 'מתמטיקה',
        grade: 'ט',
        type: 'משימת בית',
        createdAt: '20/06/2026',
    },
];

const studentResults = [
    {
        id: '3',
        title: 'בוחן - מערכת הנשימה',
        subject: 'ביולוגיה',
        grade: 'ח',
        type: 'בוחן',
        studentsCount: 24,
        avgScore: 82,
        createdAt: '21/06/2026',
    },
    {
        id: '4',
        title: 'שאלות אמריקאיות - מלחמת העצמאות',
        subject: 'היסטוריה',
        grade: 'ט',
        type: 'שאלות אמריקאיות',
        studentsCount: 18,
        avgScore: 76,
        createdAt: '19/06/2026',
    },
];

export default function TeacherContents() {
    const [tab, setTab] = useState('results');
    const navigate = useNavigate();

    const isResults = tab === 'results';
    const items = isResults ? studentResults : learningMaterials;

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
                                התכנים שלי
                            </Badge>

                            <Title mt="md" order={1}>
                                צפייה בתכנים קודמים
                            </Title>

                            <Text c="dimmed" mt="xs" size="lg">
                                כל התוצרים והתכנים הלימודיים שיצרת במקום אחד.
                            </Text>
                        </Box>

                        <Button
                            radius="xl"
                            size="md"
                            variant="gradient"
                            gradient={{ from: 'cyan', to: 'violet' }}
                            onClick={() => navigate('/teacher/createContent')}
                        >
                            יצירת תוכן חדש
                        </Button>
                    </Group>
                </Paper>

                <SegmentedControl
                    value={tab}
                    onChange={setTab}
                    size="md"
                    radius="xl"
                    data={[
                        { label: 'תוצרים עם תוצאות תלמידים', value: 'results' },
                        { label: 'תוכן לימודי', value: 'materials' },
                    ]}
                />

                <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} spacing="lg">
                    {items.map((item) => (
                        <Card
                            key={item.id}
                            radius={24}
                            p="lg"
                            shadow="xs"
                            withBorder
                        >
                            <Stack gap="md">
                                <Group justify="space-between">
                                    <Badge variant="light" radius="xl">
                                        {item.type}
                                    </Badge>

                                    <Text size="sm" c="dimmed">
                                        {item.createdAt}
                                    </Text>
                                </Group>
                                <Box>
                                    <Title order={3}>{item.title}</Title>
                                    <Text c="dimmed" mt={6}>
                                        {item.subject} · כיתה {item.grade}
                                    </Text>
                                </Box>

                                {'avgScore' in item && (
                                    <Group grow>
                                        <Paper radius="lg" p="sm" bg="#f8fafc">
                                            <Text size="xs" c="dimmed">
                                                תלמידים
                                            </Text>
                                            <Text fw={700}>
                                                {item.studentsCount}
                                            </Text>
                                        </Paper>

                                        <Paper radius="lg" p="sm" bg="#f8fafc">
                                            <Text size="xs" c="dimmed">
                                                ממוצע
                                            </Text>
                                            <Text fw={700}>
                                                {item.avgScore}
                                            </Text>
                                        </Paper>
                                    </Group>
                                )}

                                <Group mt="auto">
                                    <Button
                                        radius="xl"
                                        fullWidth
                                        onClick={() =>
                                            navigate(
                                                `/teacher/contents/${item.id}`,
                                            )
                                        }
                                    >
                                        צפייה
                                    </Button>
                                </Group>
                            </Stack>
                        </Card>
                    ))}
                </SimpleGrid>
            </Stack>
        </Box>
    );
}
