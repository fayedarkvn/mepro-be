import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserJwtPayloadDto } from "../dtos/jwt-payload.dto";

export const GetUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { ticket } = request;
    if (ticket instanceof UserJwtPayloadDto) {
      return ticket.sub;
    }
    return null;
  }
);
