import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsUniqueConstraint } from '../common/validators/is-unique.validator';
import { UserEntity } from '../entities/user.entity';
import { ImageModule } from '../providers/images/images.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ImageModule,
  ],
  providers: [UsersService, IsUniqueConstraint],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule { }
