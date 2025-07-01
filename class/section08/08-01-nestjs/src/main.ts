import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();


// <함수설명>
// - bootstrap : 함수 이름이기에 bootstrap 외에 원하는 이름으로 작성 가능합니다.
// - app.listen(3000) : 3000번 포트가 실행되서 24시간 동안 listening 하고 있을것으로 기존에 실행 중이던 3000번 포트가 존재한다면 종료시켜줘야 합니다.
// - .create(AppModule) : AppModule 안에 우리가 앞으로 만들게 되는 모든 내용들(API 등)이 포함되어 있습니다.
//     - `app.controller.spec.ts`: test 관련 코드
