import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'node:path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { configurations } from './configurations';

@Module({
  imports: [

    ConfigModule.forRoot({
      load: configurations,
      isGlobal: true,
    }),

    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
      }),
      global: true,
      inject: [ConfigService],
    }),

    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('db.host'),
        port: configService.get('db.port'),
        username: configService.get('db.username'),
        password: configService.get('db.password'),
        database: configService.get('db.database'),
        synchronize: configService.get('db.synchronize'),
        logging: configService.get('db.logging'),
        autoLoadEntities: true,
        namingStrategy: new SnakeNamingStrategy(),
      }),
      inject: [ConfigService],
    }),

    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('mailer.host'),
          port: configService.get('mailer.port'),
          secure: false,
          auth: {
            user: configService.get('mailer.user'),
            pass: configService.get('mailer.pass'),
          },
        },
        defaults: {
          from: configService.get('mailer.from'),
        },
        template: {
          dir: join(globalThis.appRoot, 'mail', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),

  ],
})
export class GlobalConfigModule { }
