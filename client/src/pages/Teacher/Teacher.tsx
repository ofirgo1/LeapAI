import {
    ActionIcon,
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    Group,
    Paper,
    SimpleGrid,
    Stack,
    Text,
    Title,
} from '@mantine/core';

export default function TeacherHome() {
    return (
        <Box dir="rtl" mih="100vh" bg="#f6f7fb">
            <Box p={{ base: 'md', md: 'xl' }}>
                <Paper
                    radius={32}
                    p={{ base: 'lg', md: 44 }}
                    style={{
                        overflow: 'hidden',
                        background:
                            'linear-gradient(135deg, #ecfeff 0%, #eef2ff 45%, #faf5ff 100%)',
                        border: '1px solid rgba(99,102,241,0.16)',
                    }}
                >
                    <Group justify="space-between" align="flex-start">
                        <Stack gap="lg" maw={680}>
                            <Group>
                                <Badge
                                    size="lg"
                                    radius="xl"
                                    variant="gradient"
                                    gradient={{ from: 'cyan', to: 'violet' }}
                                >
                                    LeapAI Teacher Hub
                                </Badge>
                            </Group>

                            <Title
                                order={1}
                                style={{
                                    fontSize: 'clamp(2.4rem, 6vw, 5.5rem)',
                                    lineHeight: 0.95,
                                    letterSpacing: '-0.06em',
                                    color: '#111827',
                                }}
                            >
                                יוצרים למידה
                                <br />
                                חכמה בדקות
                            </Title>

                            <Text size="lg" c="dimmed" maw={560} lh={1.8}>
                                צרו שיעור, סיכום, בוחן או משחק לימודי בעזרת AI —
                                מותאם לכיתה, לרמה ולמטרה שלכם.
                            </Text>

                            <Group>
                                <Button
                                    size="lg"
                                    radius="xl"
                                    variant="gradient"
                                    gradient={{ from: 'cyan', to: 'violet' }}
                                >
                                    ✨ יצירת תוכן חדש
                                </Button>
                                <Button size="lg" radius="xl" variant="white">
                                    צפייה בתכנים
                                </Button>
                            </Group>
                        </Stack>

                        <Group visibleFrom="md">
                            <Avatar radius="xl" size={54} color="violet">
                                מ
                            </Avatar>
                            <ActionIcon size={54} radius="xl" variant="white">
                                🔔
                            </ActionIcon>
                        </Group>
                    </Group>
                </Paper>

                <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg" mt="xl">
                    {[
                        [
                            '⚡',
                            'שיעור מלא',
                            'בנה מערך שיעור מלא לפי נושא, כיתה ורמת קושי.',
                            'צור שיעור',
                        ],
                        [
                            '📝',
                            'בוחן מהיר',
                            'צור שאלות אמריקאיות, פתוחות ותשובות לבדיקה.',
                            'צור בוחן',
                        ],
                        [
                            '🎮',
                            'משחק לימודי',
                            'הפוך חומר יבש למשחק קצר, כיפי ומפעיל.',
                            'צור משחק',
                        ],
                    ].map(([icon, title, desc, action]) => (
                        <Card
                            key={title}
                            radius={28}
                            p="xl"
                            shadow="xs"
                            withBorder
                        >
                            <Stack gap="md">
                                <Text size="2rem">{icon}</Text>
                                <Title order={3}>{title}</Title>
                                <Text c="dimmed" lh={1.7}>
                                    {desc}
                                </Text>
                                <Button radius="xl" variant="light">
                                    {action}
                                </Button>
                            </Stack>
                        </Card>
                    ))}
                </SimpleGrid>
            </Box>
        </Box>
    );
}
