import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppointmentStatus } from './entities/appointment.entity';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto, @Request() req) {
    return this.appointmentsService.create(createAppointmentDto, req.user.patientId);
  }

  @Get()
  async findAll(@Request() req) {
    return this.appointmentsService.findAll(req.user.id, req.user.userType);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.appointmentsService.findOne(id, req.user.id, req.user.userType);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: AppointmentStatus,
    @Request() req,
  ) {
    return this.appointmentsService.updateStatus(id, status, req.user.id, req.user.userType);
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string, @Request() req) {
    return this.appointmentsService.cancel(id, req.user.id, req.user.userType);
  }

  @Patch(':id/complete')
  async complete(@Param('id') id: string, @Request() req) {
    return this.appointmentsService.complete(id, req.user.id, req.user.userType);
  }
} 