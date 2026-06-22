import {
    Badge,
    Box,
    Button,
    Card,
    Group,
    Loader,
    SegmentedControl,
    SimpleGrid,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content, getContants } from '../../../api/contantApi';

export default function StudentContents() {
    const [tab, setTab] = useState('materials');
    const [items, setItems] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const contants = await getContants();
                setItems(contants);
            } catch (error) {
                console.error('Error fetching content:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [tab]);

    if (loading) {
        return (
            <Box
                dir="rtl"
                mih="100vh"
                bg="#f6f7fb"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Stack align="center" gap="md">
                    <Loader size="lg" />
                    <Text c="dimmed">טוען תוכן...</Text>
                </Stack>
            </Box>
        );
    }

    return (
        <Box dir="rtl" mih="100vh" bg="#f6f7fb" p={{ base: 'md', md: 'xl' }}>
            <Stack gap="xl">
                <SegmentedControl
                    value={tab}
                    onChange={setTab}
                    size="md"
                    radius="xl"
                    data={[
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
                                    <Title order={3}>
                                        {item.title}
                                    </Title>

                                    <Text c="dimmed" mt={6}>
                                        {item.subject} · כיתה{' '}
                                        {item.grade}
                                    </Text>
                                </Box>

                                <Group mt="auto">
                                    <Button
                                        radius="xl"
                                        fullWidth
                                        onClick={() =>
                                            navigate(
                                                `/student/contents/${item.id}`
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