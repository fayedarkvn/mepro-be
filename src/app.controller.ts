import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AdminGuard } from './common/guards/admin.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Hello World')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('hello-user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getHelloUser(): string {
    return this.appService.getHelloUser();
  }

  @Get('hello-admin')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  getHelloAdmin(): string {
    return this.appService.getHelloAdmin();
  }
}
