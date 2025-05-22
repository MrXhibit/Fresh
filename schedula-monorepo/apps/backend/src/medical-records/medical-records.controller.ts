import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MedicalRecordsService } from './medical-records.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MedicalRecord } from './entities/medical-record.entity';

@ApiTags('medical-records')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new medical record' })
  @ApiResponse({ status: 201, description: 'Medical record created successfully', type: MedicalRecord })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createMedicalRecordDto: CreateMedicalRecordDto) {
    return this.medicalRecordsService.create(createMedicalRecordDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all medical records' })
  @ApiResponse({ status: 200, description: 'Return all medical records', type: [MedicalRecord] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.medicalRecordsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a medical record by id' })
  @ApiResponse({ status: 200, description: 'Return the medical record', type: MedicalRecord })
  @ApiResponse({ status: 404, description: 'Medical record not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.medicalRecordsService.findOne(id);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get all medical records for a patient' })
  @ApiResponse({ status: 200, description: 'Return all medical records for the patient', type: [MedicalRecord] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByPatient(@Param('patientId') patientId: string) {
    return this.medicalRecordsService.findByPatient(patientId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a medical record' })
  @ApiResponse({ status: 200, description: 'Medical record updated successfully', type: MedicalRecord })
  @ApiResponse({ status: 404, description: 'Medical record not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateMedicalRecordDto: UpdateMedicalRecordDto) {
    return this.medicalRecordsService.update(id, updateMedicalRecordDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a medical record' })
  @ApiResponse({ status: 200, description: 'Medical record deleted successfully' })
  @ApiResponse({ status: 404, description: 'Medical record not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.medicalRecordsService.remove(id);
  }
} 