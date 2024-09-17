import { Controller, Post, UseGuards, Get, HttpCode, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto, LoginSuccessResponseDto, UserReponseDto } from './dtos/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { ApiHttpException } from 'src/common/decorators/api-http-exception.decorator';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  @ApiBody({
    type: LoginDto
  })
  @ApiOkResponse({
    type: LoginSuccessResponseDto,
  })
  @ApiHttpException(() => [UnauthorizedException])
  @Post('auth/login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  async login(@GetUser() user: UserEntity) {
    return this.authService.signIn(user);

  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: UserReponseDto,
  })
  @ApiHttpException(() => [UnauthorizedException])
  @Get('auth/me')
  @UseGuards(JwtAuthGuard)
  getProfile(@GetUser() user: UserEntity) {
    return user;
  }
}
