import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { JwtPayloadDto, UserJwtPayloadDto } from '../dtos/jwt-payload.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    const payload = await this.verifyToken(token).catch(() => {
      throw new UnauthorizedException('Invalid token');
    });

    const payloadDto = await this.verifyPayload(payload, UserJwtPayloadDto).catch((err) => {
      throw new UnauthorizedException(err.message);
    });

    request.ticket = payloadDto;
    return true;
  }

  protected extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  protected async verifyToken(token: string) {
    return this.jwtService.verify(token, {
      secret: this.configService.get('jwt.secret'),
    });
  }

  protected async verifyPayload<V, T extends JwtPayloadDto>(payload: V, cls: ClassConstructor<T>) {
    const payloadDto = plainToInstance(cls, payload);
    const errors = await validate(payloadDto);
    if (errors.length > 0) {
      throw new Error('Invalid token');
    }

    return payloadDto;
  }
}
