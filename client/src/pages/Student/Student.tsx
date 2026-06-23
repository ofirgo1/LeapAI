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
    const [studentName, setStudentName] = useState('תלמיד'); // Fallback placeholder if name is missing

    useEffect(() => {
        // Retrieve the logged-in user details from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                // Adjust property names based on whatever your authentication payload saves (e.g., firstName, name, or username)
                if (parsedUser.name) {
                    setStudentName(parsedUser.name);
                } else if (parsedUser.firstName) {
                    setStudentName(parsedUser.firstName);
                }
            } catch (error) {
                console.error('Failed to parse user details from storage', error);
            }
        }

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
                    {/* The dynamic greeting based on the loaded user state */}
                    <Title order={1}>שלום {studentName} 👋</Title>
                    <Text c="dimmed" mt={8}>
                        כאן אפשר לצפות בתכני לימוד, לתרגל וללמוד בעזרת AI.
                    </Text>
                </Box>


                {/* <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                    <Card shadow="sm" padding="lg" radius="lg" withBorder>
                        <Title order={3}>תכני לימוד</Title>
                        <Text c="dimmed" mt="sm">
                            צפייה בשיעורים, סיכומים וחומרים שהמורה שיתף.
                        </Text>
                        <Button mt="md" 
                                onClick={() =>
                                            navigate(
                                                `/student/contents`,
                                            )}
                            >צפה בתכנים</Button>
                    </Card> */}
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
                                        onClick={() => navigate(`/teacher/contents/${material.id}`)}
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