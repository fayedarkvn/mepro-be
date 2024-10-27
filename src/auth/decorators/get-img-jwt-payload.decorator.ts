import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ImgJwtPayloadDto } from "../dtos/jwt-payload.dto";

export const GetImgJwtPayload = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { ticket } = request;

    if (ticket instanceof ImgJwtPayloadDto) {
      return ticket;
    }

    return null;
  }
);
