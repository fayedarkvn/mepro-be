import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserJwtPayloadDto } from "../dtos/jwt-payload.dto";

export interface IAuthenticatedUser {
  id: number;
  email: string;
  role: string;
}

export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { ticket } = request;
    if (ticket instanceof UserJwtPayloadDto) {
      return {
        id: ticket.sub,
        email: ticket.email,
        role: ticket.role,
      } as IAuthenticatedUser;
    }
    return null;
  },
);
