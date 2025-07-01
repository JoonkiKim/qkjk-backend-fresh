import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './commons/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); //  ValidationPipe를 연결해주기
  app.useGlobalFilters(new HttpExceptionFilter()); // try-catch역할을 하는 exception필터를 연결하기
  await app.listen(3000);
}
bootstrap();
