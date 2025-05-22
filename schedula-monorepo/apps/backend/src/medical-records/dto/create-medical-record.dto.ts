import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMedicalRecordDto {
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  diagnosis: string;

  @IsString()
  @IsOptional()
  prescription?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDate()
  @IsOptional()
  followUpDate?: Date;

  @IsString()
  @IsOptional()
  followUpNotes?: string;
} 