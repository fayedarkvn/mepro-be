import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UsersService extends TypeOrmCrudService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity) public userRepo: Repository<UserEntity>,
  ) {
    super(userRepo);
  }
}
