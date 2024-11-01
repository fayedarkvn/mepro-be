import { Crud, CrudController, CrudRequest, Override, ParsedRequest } from "@dataui/crud";
import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserEntity } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { ImageResloverInterceptor } from "src/images/interceptors/image-reslover-interceptors";
import { AdminGuard } from "src/auth/guards/admin.guard";

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

  @Override()
  @UseInterceptors(ImageResloverInterceptor)
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.service.getMany(req);
  }
}
