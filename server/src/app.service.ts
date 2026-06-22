import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from './db';
import { generateMockOutput } from './mockAi';

type StudentLevel = 'easy' | 'medium' | 'hard' | 'placement';

@Injectable()
export class AppService {
  async getDbHealth() {
    const result = await db.query('SELECT NOW()');

    return {
      ok: true,
      time: result.rows[0].now,
    };
  }

  async createStudent(body: {
    email: string;
    fullName: string;
    grade?: string;
    phoneNumber?: string;
    password?: string;
  }) {
    const { email, fullName, grade, phoneNumber, password } = body;

    if (!email || !fullName) {
      throw new Error('email and fullName are required');
    }

    const result = await db.query(
      `
      INSERT INTO students
      (email, fullname, type, id, phonenumber, password, grade)
      VALUES ($1, $2, 'student', $3, $4, $5, $6)
      RETURNING *
      `,
      [
        email,
        fullName,
        this.createPublicId(),
        phoneNumber || null,
        password || null,
        grade || null,
      ],
    );

    return {
      student: result.rows[0],
    };
  }

  async createTeacher(body: {
    email: string;
    fullName: string;
    phoneNumber?: string;
    password?: string;
  }) {
    const { email, fullName, phoneNumber, password } = body;

    if (!email || !fullName) {
      throw new Error('email and fullName are required');
    }

    const result = await db.query(
      `
      INSERT INTO teachers
      (email, fullname, type, id, phonenumber, password)
      VALUES ($1, $2, 'teacher', $3, $4, $5)
      RETURNING *
      `,
      [
        email,
        fullName,
        this.createPublicId(),
        phoneNumber || null,
        password || null,
      ],
    );

    return {
      teacher: result.rows[0],
    };
  }

  async createOutput(body: {
    teacherEmail?: string;
    studentEmail?: string;
    subject: string;
    grade: string;
    difficulty?: string;
    type: string;
    content: string;
  }) {
    const {
      teacherEmail,
      studentEmail,
      subject,
      grade,
      difficulty,
      type,
      content,
    } = body;

    if (!subject || !grade || !type || !content) {
      throw new Error('subject, grade, type and content are required');
    }

    const studentProfile = await this.getStudentProfile(studentEmail);

    const materialResult = await db.query(
      `
      INSERT INTO materials (subject, grade, difficulty, content)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [subject, grade, difficulty || studentProfile.level, content],
    );

    const material = materialResult.rows[0];

    const generatedContent = generateMockOutput({
      subject,
      grade,
      type,
      content,
      studentProfile,
    });

    const shareCode = this.createShareCode();

    const outputResult = await db.query(
      `
      INSERT INTO outputs
      (material_id, type, title, content_json, share_code, teacher_email, target_student_email)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        material.id,
        type,
        generatedContent.title,
        JSON.stringify(generatedContent),
        shareCode,
        teacherEmail || null,
        studentEmail || null,
      ],
    );

    const output = outputResult.rows[0];

    return {
      outputId: output.id,
      shareCode: output.share_code,
      title: output.title,
      content: output.content_json,
      studentProfile,
    };
  }

  async getOutputByShareCode(shareCode: string) {
    const result = await db.query(
      `
      SELECT *
      FROM outputs
      WHERE share_code = $1
      LIMIT 1
      `,
      [shareCode],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('output not found');
    }

    const output = result.rows[0];

    return {
      outputId: output.id,
      shareCode: output.share_code,
      title: output.title,
      type: output.type,
      content: output.content_json,
    };
  }

  async saveResult(body: {
    outputId: string;
    studentEmail?: string;
    studentName: string;
    score: number;
    answers?: unknown[];
  }) {
    const { outputId, studentEmail, studentName, score, answers } = body;

    if (!outputId || !studentName || typeof score !== 'number') {
      throw new Error('outputId, studentName and score are required');
    }

    const result = await db.query(
      `
      INSERT INTO student_results
      (output_id, student_email, student_name, score, answers_json)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        outputId,
        studentEmail || null,
        studentName,
        score,
        JSON.stringify(answers || []),
      ],
    );

    let newLevel: StudentLevel = 'medium';

    if (score < 50) {
      newLevel = 'easy';
    } else if (score > 80) {
      newLevel = 'hard';
    }

    if (studentEmail) {
      await db.query(
        `
        UPDATE students
        SET current_level = $1
        WHERE email = $2
        `,
        [newLevel, studentEmail],
      );
    }

    return {
      result: result.rows[0],
      newLevel,
    };
  }

  async getResultsByOutputId(outputId: string) {
    const result = await db.query(
      `
      SELECT *
      FROM student_results
      WHERE output_id = $1
      ORDER BY created_at DESC
      `,
      [outputId],
    );

    return {
      results: result.rows,
    };
  }

  private createShareCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  private createPublicId() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  private async getStudentProfile(studentEmail?: string) {
    if (!studentEmail) {
      return {
        level: 'placement' as const,
        averageScore: null,
      };
    }

    const studentResult = await db.query(
      `
      SELECT current_level
      FROM students
      WHERE email = $1
      LIMIT 1
      `,
      [studentEmail],
    );

    if (studentResult.rows.length === 0) {
      return {
        level: 'placement' as const,
        averageScore: null,
      };
    }

    const results = await db.query(
      `
      SELECT score
      FROM student_results
      WHERE student_email = $1
      ORDER BY created_at DESC
      LIMIT 5
      `,
      [studentEmail],
    );

    if (results.rows.length === 0) {
      return {
        level: studentResult.rows[0].current_level || 'placement',
        averageScore: null,
      };
    }

    const scores = results.rows.map((row) => Number(row.score));
    const averageScore =
      scores.reduce((sum, score) => sum + score, 0) / scores.length;

    let level: 'easy' | 'medium' | 'hard' = 'medium';

    if (averageScore < 50) {
      level = 'easy';
    } else if (averageScore > 80) {
      level = 'hard';
    }

    return {
      level,
      averageScore,
    };
  }
}