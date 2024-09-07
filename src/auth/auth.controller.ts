import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  @Post('auth/login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    type: LoginDto
  })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }
}
