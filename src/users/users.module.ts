import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { UsersController } from './users.controller';
import { IsUniqueConstraint } from 'src/common/validators/is-unique.validator';
import { ImagesModule } from 'src/images/images.module';

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
