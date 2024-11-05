import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsUniqueConstraint } from '../common/validators/is-unique.validator';
import { UserEntity } from '../entities/user.entity';
import { ImagesModule } from '../images/images.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ImagesModule,
  ],
  providers: [UsersService, IsUniqueConstraint],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule { }
