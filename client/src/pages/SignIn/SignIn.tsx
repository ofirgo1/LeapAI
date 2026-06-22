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

const SignIn = () => {
    const form = useForm({
        initialValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },

        validate: {
            fullName: (value) =>
                value.trim().length < 2 ? 'שם חייב להכיל לפחות 2 תווים' : null,

            email: (value) =>
                /^\S+@\S+\.\S+$/.test(value) ? null : 'אימייל לא תקין',

            password: (value) =>
                value.length < 6 ? 'סיסמה חייבת להכיל לפחות 6 תווים' : null,

            confirmPassword: (value, values) =>
                value !== values.password ? 'הסיסמאות לא תואמות' : null,
        },
    });

    const handleSubmit = form.onSubmit((values) => {
        console.log(values);
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
                        מתחילים ללמוד חכם יותר.
                    </Title>

                    <Text mt="xl" size="lg" c="rgba(255,255,255,0.82)" lh={1.7}>
                        הצטרפו לפלטפורמת AI שמחברת בין תלמידים, מורים
                        והזדמנויות.
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
                            <Title order={2}>יצירת חשבון</Title>
                            <Text c="dimmed" mt={4}>
                                מלא את הפרטים כדי להתחיל
                            </Text>
                        </Box>

                        <form onSubmit={handleSubmit}>
                            <Stack>
                                <TextInput
                                    label="שם מלא"
                                    placeholder="השם שלך"
                                    size="md"
                                    radius="md"
                                    withAsterisk
                                    {...form.getInputProps('fullName')}
                                />

                                <TextInput
                                    label="אימייל"
                                    placeholder="you@example.com"
                                    size="md"
                                    radius="md"
                                    withAsterisk
                                    {...form.getInputProps('email')}
                                />

                                <PasswordInput
                                    label="סיסמה"
                                    placeholder="בחר סיסמה"
                                    size="md"
                                    radius="md"
                                    withAsterisk
                                    {...form.getInputProps('password')}
                                />

                                <PasswordInput
                                    label="אימות סיסמה"
                                    placeholder="הקלד שוב את הסיסמה"
                                    size="md"
                                    radius="md"
                                    withAsterisk
                                    {...form.getInputProps('confirmPassword')}
                                />

                                <Button
                                    type="submit"
                                    size="md"
                                    radius="md"
                                    fullWidth
                                >
                                    הרשמה
                                </Button>
                            </Stack>
                        </form>

                        <Text ta="center" c="dimmed" size="sm">
                            כבר יש לך חשבון?{' '}
                            <Anchor href="/login" fw={700}>
                                התחברות
                            </Anchor>
                        </Text>
                    </Stack>
                </Paper>
            </Box>
        </Box>
    );
};

export default SignIn;
