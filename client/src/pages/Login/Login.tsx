import {
    Anchor,
    Box,
    Button,
    Container,
    Paper,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';

const LoginPage = () => {
    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },
    });

    return (
        <Box dir="rtl" mih="100vh" style={{ display: 'flex' }}>
            <Box
                visibleFrom="md"
                style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 48,
                    color: 'white',
                    background:
                        'radial-gradient(circle at top right, rgba(255,255,255,0.28), transparent 32%), linear-gradient(135deg, #4f46e5, #7c3aed)',
                }}
            >
                <Container size={520}>
                    <Text fw={800} size="lg" mb={48}>
                        LeapAI
                    </Text>

                    <Title
                        style={{
                            fontSize: 'clamp(3rem, 5vw, 5rem)',
                            lineHeight: 1,
                            letterSpacing: '-0.06em',
                        }}
                    >
                        למידה חכמה שמגיעה לכולם.
                    </Title>

                    <Text mt="xl" size="lg" c="rgba(255,255,255,0.82)" lh={1.7}>
                        עוזרים לתלמידים ולמורים מהפריפריה ללמוד טוב יותר בעזרת
                        AI.
                    </Text>
                </Container>
            </Box>

            <Box
                style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 24,
                    background: '#f8fafc',
                }}
            >
                <Paper w="100%" maw={430} radius="xl" p="xl" shadow="md">
                    <Stack gap="lg">
                        <Box>
                            <Title order={2}>ברוך הבא</Title>
                            <Text c="dimmed" mt={4}>
                                התחבר כדי להמשיך
                            </Text>
                        </Box>

                        <form>
                            <Stack>
                                <TextInput
                                    label="אימייל"
                                    placeholder="you@example.com"
                                    size="md"
                                    radius="md"
                                    {...form.getInputProps('email')}
                                />

                                <PasswordInput
                                    label="סיסמה"
                                    placeholder="הסיסמה שלך"
                                    size="md"
                                    radius="md"
                                    {...form.getInputProps('password')}
                                />

                                <Button
                                    type="submit"
                                    size="md"
                                    radius="md"
                                    fullWidth
                                >
                                    התחברות
                                </Button>
                            </Stack>
                        </form>

                        <Text ta="center" c="dimmed" size="sm">
                            אין לך חשבון?{' '}
                            <Anchor href="/signin" fw={700}>
                                הרשמה
                            </Anchor>
                        </Text>
                    </Stack>
                </Paper>
            </Box>
        </Box>
    );
};

export default LoginPage;
