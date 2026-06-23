import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { db } from './db';
import { CreateContentPayload, generateQuizFromAi, generateSummaryFromAi } from './aiClient';

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

  async getMaterials() {
    const result = await db.query(
      `
      SELECT *
      FROM materials
      ORDER BY created_at DESC
      `,
    );

    return {
      materials: result.rows,
    };
  }

  async getMaterialById(id: string) {
    const result = await db.query(
      `
      SELECT *
      FROM materials
      WHERE id = $1
      LIMIT 1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('material not found');
    }

    return {
      material: result.rows[0],
    };
  }

  async createMaterial(body: CreateContentPayload) {
    if (
      !body.type ||
      !body.title ||
      !body.grade ||
      !body.content ||
      !body.content.subject ||
      !body.content.difficulty ||
      !body.content.prompt
    ) {
      throw new BadRequestException(
        'type, title, grade, content.subject, content.difficulty and content.prompt are required',
      );
    }

    let aiResult;

    try {
      if(body.type == 'quiz') {
        aiResult = await generateQuizFromAi(body);
      } else if(body.type == 'summary') {
        aiResult = await generateSummaryFromAi(body);
      } else {
        throw new Error("Material type not implemented");
      }
    } catch (error) {
      throw new BadGatewayException(
        error instanceof Error ? error.message : 'AI service failed',
      );
    }
    const materialResult = await db.query(
      `
      INSERT INTO materials
      (subject, title, grade, difficulty, content, prompt, file_name, type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
      `,
      [
        aiResult.subject,
        aiResult.title,
        body.grade,
        String(aiResult.difficulty || '0'),
        JSON.stringify(aiResult.content),
        body.content.prompt,
        body.content.fileName || null,
        body.type,
      ],
    );
    const material = materialResult.rows[0];

    /*const shareCode = this.createShareCode();

    const outputResult = await db.query(
      `
      INSERT INTO outputs
      (material_id, type, title, content_json, share_code, teacher_email, target_student_email)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        material.id,
        body.type,
        aiResult.title,
        JSON.stringify({
          materialId: material.id,
        }),
        shareCode,
        body.teacherEmail || null,
        null,
      ],
    );

    const output = outputResult.rows[0];*/

    return {
      material,
      outputId: '0',
      materialId: material.id,
      shareCode: '0',
      title: aiResult.title,
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

    if (!email || !fullName || !password) {
      throw new BadRequestException('email, fullName and password are required');
    }

    const normalizedEmail = email.trim().toLowerCase();

    await this.ensureEmailIsAvailable(normalizedEmail);

    const result = await db.query(
      `
      INSERT INTO students
      (email, fullname, type, id, phonenumber, password, grade)
      VALUES ($1, $2, 'student', $3, $4, $5, $6)
      RETURNING *
      `,
      [
        normalizedEmail,
        fullName,
        this.createPublicId(),
        phoneNumber || null,
        password,
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

    if (!email || !fullName || !password) {
      throw new BadRequestException('email, fullName and password are required');
    }

    const normalizedEmail = email.trim().toLowerCase();

    await this.ensureEmailIsAvailable(normalizedEmail);

    const result = await db.query(
      `
      INSERT INTO teachers
      (email, fullname, type, id, phonenumber, password)
      VALUES ($1, $2, 'teacher', $3, $4, $5)
      RETURNING *
      `,
      [
        normalizedEmail,
        fullName,
        this.createPublicId(),
        phoneNumber || null,
        password,
      ],
    );

    return {
      teacher: result.rows[0],
    };
  }

  async login(body: {
    email: string;
    password: string;
    role: 'teachers' | 'students';
  }) {
    const { email, password, role } = body;

    if (!email || !password || !role) {
      throw new BadRequestException('email, password and role are required');
    }

    if (role !== 'teachers' && role !== 'students') {
      throw new BadRequestException('role must be teachers or students');
    }

    const normalizedEmail = email.trim().toLowerCase();

    const result = await db.query(
      `
      SELECT *
      FROM ${role}
      WHERE email = $1
      LIMIT 1
      `,
      [normalizedEmail],
    );

    if (result.rows.length === 0) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const user = result.rows[0];

    if (user.password !== password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      ok: true,
      role,
      type: role,
      user,
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
    return this.createMaterial({
      type: body.type,
      title: `${body.subject} - ${body.type}`,
      teacherEmail: body.teacherEmail || null,
      grade: body.grade,
      content: {
        subject: body.subject,
        difficulty: body.difficulty || '5',
        prompt: body.content,
        fileName: null,
      },
    });
  }

  async getOutputByShareCode(shareCode: string) {
    const result = await db.query(
      `
      SELECT
        outputs.id AS output_id,
        outputs.share_code,
        outputs.type,
        outputs.teacher_email,
        outputs.target_student_email,
        materials.id AS material_id,
        materials.subject,
        materials.title,
        materials.grade,
        materials.difficulty,
        materials.content,
        materials.prompt,
        materials.file_name,
        materials.created_at
      FROM outputs
      JOIN materials ON materials.id = outputs.material_id
      WHERE outputs.share_code = $1
      LIMIT 1
      `,
      [shareCode],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('output not found');
    }

    const row = result.rows[0];

    return {
      outputId: row.output_id,
      materialId: row.material_id,
      shareCode: row.share_code,
      type: row.type,
      teacherEmail: row.teacher_email,
      studentEmail: row.target_student_email,
      material: {
        id: row.material_id,
        subject: row.subject,
        title: row.title,
        grade: row.grade,
        difficulty: row.difficulty,
        content: row.content,
        prompt: row.prompt,
        fileName: row.file_name,
        created_at: row.created_at,
      },
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
      throw new BadRequestException(
        'outputId, studentName and score are required',
      );
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
        [newLevel, studentEmail.trim().toLowerCase()],
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

  private async ensureEmailIsAvailable(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const result = await db.query(
      `
      SELECT email, type FROM students WHERE email = $1
      UNION
      SELECT email, type FROM teachers WHERE email = $1
      `,
      [normalizedEmail],
    );

    if (result.rows.length > 0) {
      throw new BadRequestException(
        'Email already exists as a student or teacher',
      );
    }
  }

  private createShareCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  private createPublicId() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}