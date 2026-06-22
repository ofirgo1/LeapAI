type StudentLevel = 'easy' | 'medium' | 'hard' | 'placement';

type StudentProfile = {
  level: StudentLevel;
  averageScore: number | null;
};

type GenerateInput = {
  subject: string;
  grade: string;
  type: string;
  content: string;
  studentProfile: StudentProfile;
};

export function generateMockOutput(input: GenerateInput) {
  const levelText =
    input.studentProfile.level === 'easy'
      ? 'רמה קלה עם הסברים פשוטים'
      : input.studentProfile.level === 'hard'
        ? 'רמה מתקדמת עם שאלות מאתגרות'
        : input.studentProfile.level === 'placement'
          ? 'מבחן רמה ראשוני'
          : 'רמה בינונית';

  return {
    title: `${input.subject} לכיתה ${input.grade} - ${levelText}`,
    summary: [
      `החומר עוסק ב: ${input.content.slice(0, 120)}`,
      `התוצר נוצר לפי פרופיל תלמיד: ${levelText}`,
    ],
    questions: [
      {
        question: `מה הרעיון המרכזי בחומר בנושא ${input.subject}?`,
        options: [
          'להבין את החומר',
          'לדלג על השיעור',
          'לזכור בלי להבין',
          'לא לענות',
        ],
        correctAnswer: 'להבין את החומר',
        explanation: 'המטרה היא לבדוק הבנה אמיתית של החומר.',
      },
      {
        question: 'מה המערכת עושה כשהיא לא מכירה את התלמיד?',
        options: [
          'מתחילה ממבחן רמה',
          'חוסמת אותו',
          'מוחקת נתונים',
          'לא יוצרת פעילות',
        ],
        correctAnswer: 'מתחילה ממבחן רמה',
        explanation: 'אם אין מידע קודם, המערכת משתמשת ברמת placement.',
      },
    ],
  };
}