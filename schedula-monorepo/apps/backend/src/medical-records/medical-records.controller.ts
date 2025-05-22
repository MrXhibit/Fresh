import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('medical-records')
@UseGuards(JwtAuthGuard)
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  async create(@Body() createMedicalRecordDto: CreateMedicalRecordDto, @Request() req) {
    return this.medicalRecordsService.create(createMedicalRecordDto, req.user.doctorId);
  }

  @Get()
  async findAll(@Request() req) {
    return this.medicalRecordsService.findAll(req.user.id, req.user.userType);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.medicalRecordsService.findOne(id, req.user.id, req.user.userType);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMedicalRecordDto: Partial<CreateMedicalRecordDto>,
    @Request() req,
  ) {
    return this.medicalRecordsService.update(id, updateMedicalRecordDto, req.user.id, req.user.userType);
  }
} 