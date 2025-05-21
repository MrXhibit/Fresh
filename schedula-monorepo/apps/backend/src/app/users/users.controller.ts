import { Controller, Logger } from '@nestjs/common';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor() {
    this.logger.log('UsersController initialized');
  }
} 