
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from '../entities/account.entity';
import { ImageEntity } from '../entities/image.entity';
import { UserPasswordEntity } from '../entities/user-password';
import { UserTokenEntity } from '../entities/user-token';
import { UserEntity } from '../entities/user.entity';
import { GoogleOauthModule } from '../providers/google-oauth/google-oauth.module';
import { ImageModule } from '../providers/images/images.module';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { ImgAuthGuard } from './guards/img-auth.guard';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([UserEntity, AccountEntity, ImageEntity, UserPasswordEntity, UserTokenEntity]),
    GoogleOauthModule,
    ImageModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, ImgAuthGuard],
  exports: [AuthService],
})
export class AuthModule { }
