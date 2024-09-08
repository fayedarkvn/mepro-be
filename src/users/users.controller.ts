import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController } from "@dataui/crud";
import { UserEntity } from 'src/entities/user.entity';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Crud({
  model: {
    type: UserEntity,
  },
  dto: {
    create: CreateUserDto,
    update: UpdateUserDto,
  }
})
export class UsersController implements CrudController<UserEntity> {
  constructor(public service: UsersService) { }
}
