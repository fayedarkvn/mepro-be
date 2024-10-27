
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from 'src/entities/account.entity';
import { UserEntity } from 'src/entities/user.entity';
import { GoogleOauthModule } from 'src/google-oauth/google-oauth.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { ImgAuthGuard } from './guards/img-auth.guard';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([UserEntity, AccountEntity]),
    GoogleOauthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, ImgAuthGuard],
  exports: [AuthService],
})
export class AuthModule { }
