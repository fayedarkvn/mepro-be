
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from '../entities/account.entity';
import { UserEntity } from '../entities/user.entity';
import { GoogleOauthModule } from '../google-oauth/google-oauth.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { ImgAuthGuard } from './guards/img-auth.guard';
import { ImageEntity } from '../entities/image.entity';
import { ImagesModule } from '../images/images.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([UserEntity, AccountEntity, ImageEntity]),
    GoogleOauthModule,
    ImagesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, ImgAuthGuard],
  exports: [AuthService],
})
export class AuthModule { }
