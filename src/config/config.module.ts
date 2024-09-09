import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configurations from './configurations';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: configurations,
      isGlobal: true,
    }),
  ],
})
export class ConfigModule { }
