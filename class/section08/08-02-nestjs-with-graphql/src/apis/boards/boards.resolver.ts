import { Query, Resolver } from '@nestjs/graphql';
import { BoardsService } from './boards.service';

// @Controller() -> 컨트롤러, get은 restAPI관련이니까 다 지워준다
// 지금은 graphql이니까 여기는 resolver가 들어와야되고
@Resolver()
export class BoardsResolver {
  constructor(
    // 서비스 의존성 주입을 여러개 받을거니까 아래로 써주는게 좋고, prettier 방지하기 위해서 // 주석을 오른쪽에 달아준다
    private readonly boardsService: BoardsService, //
  ) {}

  // @Get('products/buy')
  // 여기는 그래프큐엘이니까 get이 아니라 query가 들어와야된다
  // nestjs에 graphql까지 있지는 않기 때문에 다운로드 받아줘야된다.

  @Query(() => String, { nullable: true })
  // getHello()함수의 그래프큐엘 리턴타입(타입스크립트 타입이 아니라 그래프큐엘 리턴타입)을 적어줘야하는데, 그거는 @Query(() => String) 여기 자리에 적어준다.
  getHello(): string {
    // 여기가 getHello가 아니라 fetchBoard로 바뀌면 자동으로 commons에 만들어놓은 독스파일도 바뀐다
    // 필수가 아닌 타입으로 만들고 싶으면, @Query(() => String, {nullable:true})를 해주면 null을 허용하므로 선택으로 바뀌게 된다
    return this.boardsService.qqq();
  }
  // 위의 코드 설명 => Query역할을 할 함수를 여기서 실행할거고 이게 실행되면 아래의 getHello함수가 실행되고, 아래의 리턴값이 반환될거야. 근데 이게 웬걸? this.boardsService.qqq는 아까 서비스에서 받아온 내용이네? 그래서 그 안에있는 qqq함수를 실행할거고 그 리턴값은 string이야. 

}
