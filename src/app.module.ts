import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HttpLoggerMiddleware } from './common/logger/http-logger.middleware';
import { GlobalConfigModule } from './config/global-config.module';
import { HealthModule } from './health/health.module';
import { ImagesModule } from './images/images.module';
import { UsersModule } from './users/users.module';
import { PhotosModule } from './photos/photos.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    GlobalConfigModule,
    AuthModule,
    UsersModule,
    HealthModule,
    ImagesModule,
    PhotosModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpLoggerMiddleware)
      .forRoutes('*');
  }
}
