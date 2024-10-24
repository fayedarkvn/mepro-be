import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { SnakeNamingStrategy } from "typeorm-naming-strategies/snake-naming.strategy";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('db.host'),
        port: configService.get('db.port'),
        username: configService.get('db.username'),
        password: configService.get('db.password'),
        database: configService.get('db.database'),
        synchronize: configService.get('db.synchronize'),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        logging: configService.get('db.logging'),
        autoLoadEntities: true,
        namingStrategy: new SnakeNamingStrategy(),
      }),
      inject: [ConfigService],
    })
  ],
})
export class DbModule { }
