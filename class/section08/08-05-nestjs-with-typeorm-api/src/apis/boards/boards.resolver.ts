// 게시판 API구조를 만들어보자. fetch와 create하는 방법을 해볼거다. 잘 모르겠으면 이 부분은 다시 듣자

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BoardsService } from './boards.service';
import { Board } from './entities/board.entity';
import { CreateBoardInput } from './dto/create-board.input';

@Resolver()
export class BoardsResolver {
  constructor(
    private readonly boardsService: BoardsService, //
  ) {}

  @Query(() => [Board], { nullable: true })
  fetchBoards(): Board[] {
    return this.boardsService.findAll();
  }
  // fetchBoards함수의 결과값 타입이 Board[]이니까 그걸 써주고, 플레이그라운드에서 배열을 표시할떄는 [Board] 이런 형태로 써주는거다.(클래스는 타입스크립트로 활용가능한데 엔티티도 클래스니까 타입스크립트로 활용가능, dto도 마찬가지!) 그리고 여기는 Query부분이니까 엔티티를 사용한다!<> Mutation은 dto를 사용한다
  // ** 근데!! 그냥 엔티티만 만들어놓고 타입을 선언하면 안됨. 왜냐면 그건 디비쪽의 타입스크립트에 대한 선언이지, 그래프큐엘에 대한 선언이 아니기 떄문! -> 엔티티쪽에서 그래프큐엘 플레이그라운드를 위한 @데코레이터 를 또 써줘야된다

  @Mutation(() => String) // () => String 이 부분을 써줘야 플레이그라운드가 만들어지는거다
  createBoard(
    // 플레이그라운드 작성하는 것처럼 아래에 어떤 값을 받을 건지 입력해주는거임
    // @Args('writer') writer: string, // ()안쪽은 gql타입이고, 그 뒤는 타입스크립트 타입니다
    // @Args('title') title: string,
    // @Args({ name: 'contents', nullable: true }) contents: string, // 각 인자에서 필수아님을 설정해주고 싶으면 이렇게 하면 된다

    // 하나씩 선언하는게 아니라 입력을 받는 값에 대한 타입을 묶어서 선언하고 싶으면 dto폴더에 만들어주면 된다
    @Args('createBoardInput') createBoardInput: CreateBoardInput,
  ): string {
    // return this.boardsService.create({writer, title, contents}); // 이건 따로따로 주고받는 방법
    // service쪽에서 응답을 받고 여기서 또 return을 해줘서 브라우저 쪽으로 응답을 넘겨줘야됨

    // 이거는 묶어서 주고받는 방법
    return this.boardsService.create({ createBoardInput });
  }
}
