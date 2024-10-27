import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ImgJwtPayloadDto } from '../dtos/jwt-payload.dto';
import { AuthGuard } from './auth.guard';

@Injectable()
export class ImgAuthGuard extends AuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.query?.token;
    if (!token) {
      request["ticket"] = null;
      return true;
    }

    const payload = await this.verifyToken(token).catch(() => {
      throw new UnauthorizedException('Invalid token');
    });

    const payloadDto = await this.verifyPayload(payload, ImgJwtPayloadDto).catch((err) => {
      throw new UnauthorizedException(err.message);
    });

    request["ticket"] = payloadDto;
    return true;
  }
}
