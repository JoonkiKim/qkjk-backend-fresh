import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsResolver } from './boards.resolver';

@Module({
  imports: [],
  // controllers: [AppController], 여기서는 리졸버를 쓰기 때문에 아예 컨트롤러 부분을 없애고, 컨트롤러 역할을 하는 리졸버는 서비스 옆에 써준다
  providers: [
    BoardsResolver, //
    BoardsService,
  ],
})
export class BoardsModule {}
