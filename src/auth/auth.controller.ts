import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, HttpCode, Post, UnauthorizedException, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiHttpException } from '../common/decorators/api-http-exception.decorator';
import { UserDto } from '../users/dto/user.dto';
import { AuthService } from './auth.service';
import { GetUser, IAuthenticatedUser } from './decorators/get-user.decorator';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { GetPasswordResponseDto } from './dtos/get-password.dto';
import { GoogleOAuthDto } from './dtos/google-oauth.dto';
import { SignInDto, SignInSuccessResponseDto, } from './dtos/sign-in.dto';
import { SignUpDto, SignUpSuccessResponseDto } from './dtos/sign-up.dto';
import { AuthGuard } from './guards/auth.guard';

@ApiTags('Auth')
@Controller('auth')
@UsePipes(new ValidationPipe())
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  @Post('sign-in')
  @ApiOkResponse({ type: SignInSuccessResponseDto })
  @ApiHttpException(() => [BadRequestException, UnauthorizedException])
  @HttpCode(200)
  async signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Post('sign-up')
  @ApiOkResponse({ type: SignUpSuccessResponseDto })
  @ApiHttpException(() => [BadRequestException])
  @HttpCode(200)
  async signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('google')
  @ApiOkResponse({ type: SignInSuccessResponseDto })
  @ApiHttpException(() => [BadRequestException, UnauthorizedException])
  @HttpCode(200)
  googleSignIn(@Body() dto: GoogleOAuthDto) {
    return this.authService.googleSignIn(dto);
  }

  @Get('password')
  @ApiResponse({ type: GetPasswordResponseDto })
  @ApiHttpException(() => [UnauthorizedException])
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getPassword(@GetUser() authenticatedUser: IAuthenticatedUser) {
    return this.authService.getPassword(authenticatedUser);
  }

  @Post('change-password')
  @ApiHttpException(() => [BadRequestException, UnauthorizedException])
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async changePassword(@Body() dto: ChangePasswordDto, @GetUser() authenticatedUser: IAuthenticatedUser) {
    if (dto.oldPassword) {
      return this.authService.chagePassword(dto, authenticatedUser);
    }
    else {
      return this.authService.createPassword(dto, authenticatedUser);
    }
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserDto })
  @ApiHttpException(() => [UnauthorizedException])
  @UseGuards(AuthGuard)
  async getProfile(@GetUser() authenticatedUser: IAuthenticatedUser) {
    return this.authService.getProfile(authenticatedUser);
  }
}
