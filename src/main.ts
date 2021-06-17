import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('trust proxy', process.env.API_TRUST_PROXY === 'true' ? 1 : 0);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableCors({
    credentials: true,
    origin: [
      process.env.CLIENT_INTERNAL_HOST,
      process.env.CLIENT_EXTERNAL_HOST,
    ],
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Tradistonks API')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000, '0.0.0.0', () =>
    console.log(`Listening on 0.0.0.0:3000`),
  );
}
bootstrap();
