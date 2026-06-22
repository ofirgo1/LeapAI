import {
    Box,
    Button,
    Card,
    SimpleGrid,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const StudentHome = () => {
    const navigate = useNavigate();
    return (
        <Box dir="rtl" p="xl" bg="#f8fafc" mih="100vh">
            <Stack gap="xl">
                <Box>
                    <Title order={1}>שלום תלמיד 👋</Title>
                    <Text c="dimmed" mt={8}>
                        כאן אפשר לצפות בתכני לימוד, לתרגל וללמוד בעזרת AI.
                    </Text>
                </Box>

                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
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
                    </Card>

                    <Card shadow="sm" padding="lg" radius="lg" withBorder>
                        <Title order={3}>תרגול</Title>
                        <Text c="dimmed" mt="sm">
                            פתרון שאלות, בחנים ומשחקים לימודיים.
                        </Text>
                        <Button mt="md" variant="light">
                            התחל תרגול
                        </Button>
                    </Card>
                </SimpleGrid>
            </Stack>
        </Box>
    );
};

export default StudentHome;
