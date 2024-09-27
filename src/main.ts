import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { envs } from './config';

/*
//* SIN MICRO SERVICIOS
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('ProductsMS-main');

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(envs.port);
  logger.log(`App Running on port ${envs.port}`);
}
bootstrap();
*/

//* CON MICRO SERVICIOS
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      port: envs.port,
    },
  });
  const logger = new Logger('ProductsMS-main');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen();
  logger.log(`Products Microservices Running on port ${envs.port}`);
}
bootstrap();
