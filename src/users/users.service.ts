import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService extends TypeOrmCrudService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity) public userRepo: Repository<UserEntity>
  ) {
    super(userRepo);
  }
}
