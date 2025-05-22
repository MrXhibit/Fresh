import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: true,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${resetToken}`;
    
    await this.transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    });
  }

  async sendAppointmentConfirmation(
    email: string,
    appointmentDetails: {
      date: string;
      time: string;
      doctorName: string;
      type: string;
    },
  ): Promise<void> {
    await this.transporter.sendMail({
      to: email,
      subject: 'Appointment Confirmation',
      html: `
        <h1>Appointment Confirmed</h1>
        <p>Your appointment has been confirmed with the following details:</p>
        <ul>
          <li>Date: ${appointmentDetails.date}</li>
          <li>Time: ${appointmentDetails.time}</li>
          <li>Doctor: ${appointmentDetails.doctorName}</li>
          <li>Type: ${appointmentDetails.type}</li>
        </ul>
        <p>Please arrive 10 minutes before your scheduled time.</p>
      `,
    });
  }

  async sendAppointmentReminder(
    email: string,
    appointmentDetails: {
      date: string;
      time: string;
      doctorName: string;
      type: string;
    },
  ): Promise<void> {
    await this.transporter.sendMail({
      to: email,
      subject: 'Appointment Reminder',
      html: `
        <h1>Appointment Reminder</h1>
        <p>This is a reminder for your upcoming appointment:</p>
        <ul>
          <li>Date: ${appointmentDetails.date}</li>
          <li>Time: ${appointmentDetails.time}</li>
          <li>Doctor: ${appointmentDetails.doctorName}</li>
          <li>Type: ${appointmentDetails.type}</li>
        </ul>
        <p>Please arrive 10 minutes before your scheduled time.</p>
      `,
    });
  }
} 