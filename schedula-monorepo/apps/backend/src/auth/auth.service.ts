import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterDto, UserType } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { Doctor } from '../users/entities/doctor.entity';
import { Patient } from '../users/entities/patient.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, userType, ...userData } = registerDto;

    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      userType,
      ...userData,
    });

    await this.usersRepository.save(user);

    // Create doctor or patient profile
    if (userType === UserType.DOCTOR) {
      const doctor = this.doctorsRepository.create({
        userId: user.id,
        specialization: registerDto.specialization,
        licenseNumber: registerDto.licenseNumber,
      });
      await this.doctorsRepository.save(doctor);
    } else {
      const patient = this.patientsRepository.create({
        userId: user.id,
        dateOfBirth: registerDto.dateOfBirth,
        gender: registerDto.gender,
        address: registerDto.address,
      });
      await this.patientsRepository.save(patient);
    }

    // Generate JWT token
    const token = this.jwtService.sign({ 
      sub: user.id,
      email: user.email,
      userType: user.userType,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      userType: user.userType,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
      },
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      // Don't reveal that the email doesn't exist
      return;
    }

    // Generate password reset token
    const resetToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '1h' },
    );

    // Save reset token to user
    user.resetToken = resetToken;
    await this.usersRepository.save(user);

    // Send reset email
    await this.mailService.sendPasswordResetEmail(email, resetToken);
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      // Verify token
      const payload = this.jwtService.verify(token);
      const user = await this.usersRepository.findOne({ where: { id: payload.sub } });

      if (!user || user.resetToken !== token) {
        throw new UnauthorizedException('Invalid or expired reset token');
      }

      // Update password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetToken = null;
      await this.usersRepository.save(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
  }
} 