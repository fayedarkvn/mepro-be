import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserEntity } from "src/entities/user.entity";

export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { user } = request;
    if (user instanceof UserEntity) {
      return user;
    }
    return null;
  }
);
