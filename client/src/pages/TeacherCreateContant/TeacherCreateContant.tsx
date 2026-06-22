import {
    Badge,
    Box,
    Button,
    Checkbox,
    Divider,
    FileInput,
    Group,
    Paper,
    Select,
    Stack,
    Text,
    Textarea,
    TextInput,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';

import { createContent } from '../../api/contantApi';

export default function TeacherCreateContent() {
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            title: '',
            outputType: '',
            grade: '',
            difficulty: '',
            prompt: '',
            file: null as File | null,
        },

        validate: {
            title: (value: string) =>
                value.trim().length < 2 ? 'יש להזין כותרת / נושא לימודי' : null,

            outputType: (value: string) => (value ? null : 'יש לבחור סוג תוצר'),

            grade: (value: string) =>
                value ? null : 'יש לבחור כיתה / רמת למידה',

            difficulty: (value: string) => (value ? null : 'יש לבחור רמת קושי'),
        },
    });

    const handleSubmit = form.onSubmit(async (values) => {
        try {
            const payload = {
                type: values.outputType,
                title: values.title,
                grade: values.grade,
                content: {
                    subject: values.title,
                    difficulty: values.difficulty,
                    prompt: values.prompt,
                    fileName: values.file?.name ?? null,
                },
            };

            console.log('payload to backend:', payload);

            await createContent(payload);

            navigate('/teacher/contents');
        } catch (error) {
            console.error('Error creating content:', error);
        }
    });

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
                                יצירת תוכן חדש
                            </Badge>

                            <Title mt="md" order={1}>
                                יצירה עם כלי AI
                            </Title>

                            <Text c="dimmed" mt="xs" size="lg">
                                הגדירו נושא, סוג תוצר, כיתה ורמת קושי — והמערכת
                                תיצור תוכן לימודי מותאם.
                            </Text>
                        </Box>

                        <Button
                            radius="xl"
                            variant="white"
                            onClick={() => navigate('/teacher/contents')}
                        >
                            חזרה לתכנים
                        </Button>
                    </Group>
                </Paper>

                <Paper
                    radius={28}
                    p={{ base: 'lg', md: 'xl' }}
                    shadow="xs"
                    withBorder
                >
                    <form onSubmit={handleSubmit}>
                        <Stack gap="lg">
                            <Box>
                                <Title order={2}>פרטי התוכן</Title>
                                <Text c="dimmed" mt={4}>
                                    מלאו את הפרטים הבסיסיים ליצירת הפרומפט.
                                </Text>
                            </Box>

                            <TextInput
                                label="כותרת / נושא לימודי"
                                placeholder="לדוגמה: חוקי ניוטון"
                                size="md"
                                radius="md"
                                withAsterisk
                                {...form.getInputProps('title')}
                            />

                            <Group grow align="flex-start">
                                <Select
                                    label="איזה תוצר תרצה ליצור?"
                                    placeholder="בחר סוג תוצר"
                                    size="md"
                                    radius="md"
                                    withAsterisk
                                    data={[
                                        {
                                            value: 'summary',
                                            label: 'סיכום לימודי',
                                        },
                                        {
                                            value: 'homework',
                                            label: 'משימת בית',
                                        },
                                        { value: 'quiz', label: 'בוחן' },
                                        {
                                            value: 'multiple_choice',
                                            label: 'שאלות אמריקאיות',
                                        },
                                        { value: 'game', label: 'משחק לימודי' },
                                        {
                                            value: 'lesson',
                                            label: 'שיעור להצגה פרונטלית',
                                        },
                                    ]}
                                    {...form.getInputProps('outputType')}
                                />

                                <Select
                                    label="רמת למידה / כיתה"
                                    placeholder="בחר כיתה"
                                    size="md"
                                    radius="md"
                                    withAsterisk
                                    data={[
                                        'כיתה א׳',
                                        'כיתה ב׳',
                                        'כיתה ג׳',
                                        'כיתה ד׳',
                                        'כיתה ה׳',
                                        'כיתה ו׳',
                                        'כיתה ז׳',
                                        'כיתה ח׳',
                                        'כיתה ט׳',
                                        'כיתה י׳',
                                        'כיתה י״א',
                                        'כיתה י״ב',
                                    ]}
                                    {...form.getInputProps('grade')}
                                />

                                <Select
                                    label="רמת קושי"
                                    placeholder="בחר רמת קושי"
                                    size="md"
                                    radius="md"
                                    withAsterisk
                                    data={[
                                        { value: 'easy', label: 'קל' },
                                        { value: 'medium', label: 'בינוני' },
                                        { value: 'hard', label: 'קשה' },
                                    ]}
                                    {...form.getInputProps('difficulty')}
                                />
                            </Group>

                            <Textarea
                                label="הנחיות נוספות ל־AI"
                                placeholder="לדוגמה: תכתוב בשפה פשוטה, תוסיף דוגמאות מהחיים, תשלב 5 שאלות בסוף..."
                                minRows={5}
                                size="md"
                                radius="md"
                                {...form.getInputProps('prompt')}
                            />

                            <Divider
                                label="אפשרויות מתקדמות"
                                labelPosition="center"
                            />

                            <FileInput
                                label="הוספת חומר לימודי"
                                description="אופציונלי — ניתן לצרף קובץ שה־AI יתבסס עליו בהמשך"
                                placeholder="בחר קובץ"
                                size="md"
                                radius="md"
                                clearable
                                {...form.getInputProps('file')}
                            />

                            <Stack gap="sm">
                                <Checkbox
                                    label="לאשר פרסום באתר עבור התלמידים"
                                    {...form.getInputProps(
                                        'publishToStudents',
                                        {
                                            type: 'checkbox',
                                        },
                                    )}
                                />

                                <Checkbox
                                    label="ליצור שיעור ולשמור להצגה פנים אל פנים"
                                    {...form.getInputProps(
                                        'saveForPresentation',
                                        {
                                            type: 'checkbox',
                                        },
                                    )}
                                />
                            </Stack>

                            <Group justify="space-between" mt="md">
                                <Button
                                    type="button"
                                    variant="light"
                                    radius="xl"
                                    onClick={() => form.reset()}
                                >
                                    להתחיל מחדש
                                </Button>

                                <Button
                                    type="submit"
                                    radius="xl"
                                    size="md"
                                    variant="gradient"
                                    gradient={{ from: 'cyan', to: 'violet' }}
                                >
                                    יצירת תוכן עם AI
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </Paper>
            </Stack>
        </Box>
    );
}
