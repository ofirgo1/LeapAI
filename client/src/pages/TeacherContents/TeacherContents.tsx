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
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content, getContants } from '../../api/contantApi';

export default function TeacherContents() {
    const [tab, setTab] = useState('results');
    const [items, setItems] = useState<Content[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const contants = await getContants();
                setItems(contants);
            } catch (error) {
                console.error('Error fetching content:', error);
            }
        };

        fetchData();
    }, [tab]);

    console.log(items);

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
                    data={[{ label: 'תוכן לימודי', value: 'materials' }]}
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
