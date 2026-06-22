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
    TextInput,
} from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content, getContants } from '../../../api/contantApi';

export default function StudentContents() {
    const [tab, setTab] = useState('materials');
    const [items, setItems] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<string | null>(null);

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

    // ---------------- FILTER LOGIC ----------------
    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const matchesSearch = item.title
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchesType = typeFilter
                ? item.type === typeFilter
                : true;

            return matchesSearch && matchesType;
        });
    }, [items, search, typeFilter]);

    // ---------------- LOADING ----------------
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

    // ---------------- UI ----------------
    return (
        <Box dir="rtl" mih="100vh" bg="#f6f7fb" p="xl">
            <Stack gap="xl">
                {/* HEADER FILTERS */}
                <SegmentedControl
                    value={tab}
                    onChange={setTab}
                    size="md"
                    radius="xl"
                    data={[{ label: 'תוכן לימודי', value: 'materials' }]}
                />

                <Group>
                    {/* SEARCH */}
                    <TextInput
                        placeholder="חיפוש לפי כותרת..."
                        value={search}
                        onChange={(e) => setSearch(e.currentTarget.value)}
                        style={{ flex: 1 }}
                    />

                    {/* TYPE FILTER */}
                    <SegmentedControl
                        value={typeFilter || 'all'}
                        onChange={(value) =>
                            setTypeFilter(value === 'all' ? null : value)
                        }
                        data={[
                            { label: 'הכל', value: 'all' },
                            { label: 'סיכום', value: 'summary' },
                            { label: 'בוחן', value: 'quiz' },
                        ]}
                    />
                </Group>

                {/* CARDS */}
                <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} spacing="lg">
                    {filteredItems.map((item) => (
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

                                {/* BADGE FILTER BUTTONS */}
                                <Group gap="xs">
                                    <Badge
                                        variant="outline"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() =>
                                            setTypeFilter(item.type)
                                        }
                                    >
                                        {item.type}
                                    </Badge>

                                    <Badge variant="outline">
                                        {item.subject}
                                    </Badge>

                                    <Badge variant="outline">
                                        כיתה {item.grade}
                                    </Badge>
                                </Group>

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

                {/* EMPTY STATE */}
                {filteredItems.length === 0 && (
                    <Box ta="center" py="xl">
                        <Text c="dimmed">לא נמצאו תכנים מתאימים</Text>
                    </Box>
                )}
            </Stack>
        </Box>
    );
}