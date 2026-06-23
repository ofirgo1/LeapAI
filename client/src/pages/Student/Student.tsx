// client/src/pages/Student/Student.tsx
import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    SimpleGrid,
    Stack,
    Text,
    Title,
    Badge,
    Group,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { getContants, Content } from '../../api/contantApi';

const StudentHome = () => {
    const navigate = useNavigate();
    const [materials, setMaterials] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const data = await getContants();
                setMaterials(data || []);
            } catch (error) {
                console.error('Failed to fetch contents:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMaterials();
    }, []);

    return (
        <Box dir="rtl" p="xl" bg="#f8fafc" mih="100vh">
            <Stack gap="xl">
                <Box>
                    <Title order={1}>שלום תלמיד 👋</Title>
                    <Text c="dimmed" mt={8}>
                        כאן אפשר לצפות בתכני לימוד, לתרגל וללמוד בעזרת AI.
                    </Text>
                </Box>

                <Title order={2}>חומרי הלימוד והמשימות שלי</Title>
                
                {loading ? (
                    <Text>טוען תכנים...</Text>
                ) : materials.length === 0 ? (
                    <Text c="dimmed">אין עדיין חומרי לימוד זמינים.</Text>
                ) : (
                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} gap="md">
                        {materials.map((material) => (
                            <Card key={material.id} shadow="sm" padding="lg" radius="lg" withBorder>
                                <Group justify="space-between" mb="xs">
                                    <Text fw={700} size="lg">
                                        {material.title || material.subject}
                                    </Text>
                                    <Badge color={material.type === 'quiz' ? 'violet' : 'blue'}>
                                        {material.type === 'quiz' ? 'בוחן / תרגול' : 'סיכום שיעור'}
                                    </Badge>
                                </Group>

                                <Text size="sm" c="dimmed" mb="md">
                                    כיתה: {material.grade} | רמת קושי: {material.difficulty}
                                </Text>

                                {material.type === 'quiz' ? (
                                    <Button 
                                        fullWidth 
                                        color="violet" 
                                        onClick={() => navigate(`/student/quiz/${material.id}`)}
                                    >
                                        התחל תרגול בוחן
                                    </Button>
                                ) : (
                                    <Button 
                                        fullWidth 
                                        variant="light"
                                        onClick={() => navigate(`/teacher/contents/${material.id}`)} // Reusing or linking content view
                                    >
                                        צפה בסיכום
                                    </Button>
                                )}
                            </Card>
                        ))}
                    </SimpleGrid>
                )}
            </Stack>
        </Box>
    );
};

export default StudentHome;