import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TimeSlotStatus } from './entities/schedule.entity';

@ApiTags('schedules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new schedule' })
  @ApiResponse({ status: 201, description: 'Schedule created successfully', type: Schedule })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createScheduleDto: CreateScheduleDto, @Request() req) {
    return this.schedulesService.create(createScheduleDto, req.user.doctorId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all schedules' })
  @ApiResponse({ status: 200, description: 'Return all schedules', type: [Schedule] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Request() req) {
    return this.schedulesService.findAll(req.user.doctorId);
  }

  @Get('available')
  async findAvailableSlots(
    @Query('doctorId') doctorId: string,
    @Query('date') date: string,
  ) {
    return this.schedulesService.findAvailableSlots(doctorId, new Date(date));
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: TimeSlotStatus,
    @Request() req,
  ) {
    return this.schedulesService.updateStatus(id, status, req.user.doctorId);
  }

  @Patch(':id/book')
  async markAsBooked(@Param('id') id: string, @Request() req) {
    return this.schedulesService.markAsBooked(id, req.user.doctorId);
  }

  @Patch(':id/unavailable')
  async markAsUnavailable(@Param('id') id: string, @Request() req) {
    return this.schedulesService.markAsUnavailable(id, req.user.doctorId);
  }

  @Patch(':id/available')
  async markAsAvailable(@Param('id') id: string, @Request() req) {
    return this.schedulesService.markAsAvailable(id, req.user.doctorId);
  }
} 