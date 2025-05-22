import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserType } from '../../users/entities/user.entity';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserType)
  @IsNotEmpty()
  userType: UserType;

  // Optional fields for doctor
  specialization?: string;
  licenseNumber?: string;

  // Optional fields for patient
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
} 