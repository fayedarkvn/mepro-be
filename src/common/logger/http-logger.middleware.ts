import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, httpVersion, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      this.logger.log(
        JSON.stringify(`${method} ${originalUrl} HTTP${httpVersion}`) + " " +
        statusCode + " " +
        contentLength + " " +
        JSON.stringify(userAgent) + " " +
        JSON.stringify(ip)
      );
    });

    next();
  }
}
