import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateMedicalRecordDto {
  @ApiProperty({
    description: 'ID of the patient',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  patientId: string;

  @ApiProperty({
    description: 'Date of the medical record',
    example: '2024-03-20'
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Diagnosis of the patient',
    example: 'Common cold with fever'
  })
  @IsString()
  diagnosis: string;

  @ApiProperty({
    description: 'Prescription given to the patient',
    example: 'Paracetamol 500mg, 3 times daily',
    required: false
  })
  @IsOptional()
  @IsString()
  prescription?: string;

  @ApiProperty({
    description: 'Additional notes about the patient',
    example: 'Patient should rest and drink plenty of fluids',
    required: false
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Follow-up appointment date',
    example: '2024-03-27',
    required: false
  })
  @IsOptional()
  @IsDateString()
  followUpDate?: string;

  @ApiProperty({
    description: 'Notes for the follow-up appointment',
    example: 'Check if symptoms have improved',
    required: false
  })
  @IsOptional()
  @IsString()
  followUpNotes?: string;
} 