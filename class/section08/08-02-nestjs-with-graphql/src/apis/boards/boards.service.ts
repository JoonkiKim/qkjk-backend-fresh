import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.DEFAULT }) // 인젝션 스코프 => 싱글톤(new 한번)으로 할래말래? => 싱글톤으로 할거면 Scope.DEFAULT / 안할거면 Scope.REQUEST (매 요청마다 new를 해준다) / TRANSIENT는 필요할때마다 수시로 new한다는 뜻
// 우리는 싱글톤을 할거고, 스코프 부분을 없애도 싱글톤이고, DEFAULT로 해도 싱글톤이고, 아예 Injectable을 없애도 싱글톤이다
export class BoardsService {
  qqq(): string {
    return 'Hello World!!';
  }
}
