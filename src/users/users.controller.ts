import { Crud, CrudController } from "@dataui/crud";
import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { UserEntity } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard, AdminGuard)
@Crud({
  model: {
    type: UserDto,
  },
  dto: {
    create: CreateUserDto,
    update: UpdateUserDto,
  }
})
export class UsersController implements CrudController<UserEntity> {
  constructor(public service: UsersService) { }
}
