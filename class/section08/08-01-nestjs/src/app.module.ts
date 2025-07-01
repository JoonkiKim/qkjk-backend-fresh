import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
  // 여기가 index.js역할이니까, 의존성을 '주입해주는' 곳임. AppService를 컨트롤러 쪽에 주입해주면 컨트롤러에서 그걸 받아서 사용함
})
export class AppModule {}
