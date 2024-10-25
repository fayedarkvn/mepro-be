import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, HttpCode, Post, UnauthorizedException, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiHttpException } from 'src/common/decorators/api-http-exception.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { GetPasswordResponseDto } from './dtos/get-password.dto';
import { GoogleOAuthDto } from './dtos/google-oauth.dto';
import { SignInDto, SignInSuccessResponseDto, } from './dtos/sign-in.dto';
import { SignUpDto, SignUpSuccessResponseDto } from './dtos/sign-up.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
@UsePipes(new ValidationPipe())
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  @ApiOkResponse({ type: SignInSuccessResponseDto })
  @ApiHttpException(() => [UnauthorizedException])
  @Post('sign-in')
  @HttpCode(200)
  async signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @ApiOkResponse({ type: SignUpSuccessResponseDto })
  @ApiHttpException(() => [BadRequestException])
  @Post('sign-up')
  @HttpCode(200)
  async signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('google')
  googleSignIn(@Body() dto: GoogleOAuthDto) {
    return this.authService.googleSignIn(dto);
  }

  @ApiResponse({ type: GetPasswordResponseDto })
  @ApiHttpException(() => [UnauthorizedException])
  @Get('password')
  @UseGuards(JwtAuthGuard)
  async getPassword(@GetUser() user: UserEntity) {
    return this.authService.getPassword(user);
  }

  @ApiHttpException(() => [BadRequestException, UnauthorizedException])
  @Post('change-password')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async changePassword(@Body() dto: ChangePasswordDto, @GetUser() user: UserEntity) {
    return this.authService.chagePassword(dto, user);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: UserDto })
  @ApiHttpException(() => [UnauthorizedException])
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@GetUser() user: UserEntity) {
    return user;
  }
}
