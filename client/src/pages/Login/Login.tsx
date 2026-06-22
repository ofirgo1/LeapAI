import {
    Anchor,
    Box,
    Button,
    Container,
    Group,
    Paper,
    PasswordInput,
    Radio,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { loginRequest } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
            type: 'students',
        },
        validate: {
            email: (value) =>
                /^\S+@\S+\.\S+$/.test(value) ? null : 'אימייל לא תקין',

            password: (value) =>
                value.length < 6 ? 'סיסמה חייבת להכיל לפחות 6 תווים' : null,

            type: (value) => (value ? null : 'יש לבחור סוג משתמש'),
        },
    });

    const handleSubmit = form.onSubmit(async (values) => {
        try {
            const response = await loginRequest(values);

            if (response?.type) {
                navigate(`/${response.type}`);
                return;
            }
        } catch (error) {}
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

                        <form onSubmit={handleSubmit}>
                            <Stack>
                                <TextInput
                                    withAsterisk
                                    label="אימייל"
                                    placeholder="you@example.com"
                                    size="md"
                                    radius="md"
                                    {...form.getInputProps('email')}
                                />

                                <PasswordInput
                                    withAsterisk
                                    label="סיסמה"
                                    placeholder="הסיסמה שלך"
                                    size="md"
                                    radius="md"
                                    {...form.getInputProps('password')}
                                />

                                <Radio.Group
                                    label="אני"
                                    withAsterisk
                                    size="md"
                                    {...form.getInputProps('role')}
                                >
                                    <Group mt="md">
                                        <Radio value="students" label="תלמיד" />
                                        <Radio value="teachers" label="מורה" />
                                    </Group>
                                </Radio.Group>

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
