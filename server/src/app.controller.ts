import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth() {
    return {
      ok: true,
      message: 'Server is running',
    };
  }

  @Get('health/db')
  getDbHealth() {
    return this.appService.getDbHealth();
  }

  @Get('materials')
  getMaterials() {
    return this.appService.getMaterials();
  }

  @Get('materials/:id')
  getMaterialById(@Param('id') id: string) {
    return this.appService.getMaterialById(id);
  }

  @Post('students')
  createStudent(
    @Body()
    body: {
      email: string;
      fullName: string;
      grade?: string;
      phoneNumber?: string;
      password?: string;
    },
  ) {
    return this.appService.createStudent(body);
  }

  @Post('teachers')
  createTeacher(
    @Body()
    body: {
      email: string;
      fullName: string;
      id?: string;
      phoneNumber?: string;
      password?: string;
    },
  ) {
    return this.appService.createTeacher(body);
  }

  @Post('auth/login')
  login(
    @Body()
    body: {
      email: string;
      password: string;
      role: 'teachers' | 'students';
    },
  ) {
    return this.appService.login(body);
  }

  @Post('outputs')
  createOutput(
    @Body()
    body: {
      teacherEmail?: string;
      studentEmail?: string;
      subject: string;
      grade: string;
      difficulty?: string;
      type: string;
      content: string;
    },
  ) {
    return this.appService.createOutput(body);
  }

  @Get('outputs/:shareCode')
  getOutput(@Param('shareCode') shareCode: string) {
    return this.appService.getOutputByShareCode(shareCode);
  }

  @Post('results')
  saveResult(
    @Body()
    body: {
      outputId: string;
      studentEmail?: string;
      studentName: string;
      score: number;
      answers?: unknown[];
    },
  ) {
    return this.appService.saveResult(body);
  }

  @Get('results/:outputId')
  getResults(@Param('outputId') outputId: string) {
    return this.appService.getResultsByOutputId(outputId);
  }
}