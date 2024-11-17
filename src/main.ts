import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { resolve } from 'node:path';

declare const module: any;
declare global {
  // eslint-disable-next-line no-var, vars-on-top
  var appRoot: string;
};

globalThis.appRoot = resolve(__dirname);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Enable CORS
  app.enableCors();

  // Enable validation
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Me Pro API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Get the port from the config
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('app.port') || 3000;

  // Start the app
  await app.listen(port, () => {
    logger.log(`Server is running on http://localhost:${port}`);
  });

  // Hot Module Replacement
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
