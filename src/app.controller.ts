import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { AuthGuard } from './auth/guards/auth.guard';
import { AdminGuard } from './common/guards/admin.guard';

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
  @UseGuards(AuthGuard)
  getHelloUser(): string {
    return this.appService.getHelloUser();
  }

  @Get('hello-admin')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, AdminGuard)
  getHelloAdmin(): string {
    return this.appService.getHelloAdmin();
  }
}
