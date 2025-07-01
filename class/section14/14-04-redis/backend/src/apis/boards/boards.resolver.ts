// resovler를 통해 디비에 데이터를 저장하는 것처럼 레디스에도 똑같이 저장해보자! -> 아래의 resolver를 생성한 다음에 플레이그라운드에서 작성하면 됨!

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BoardsService } from './boards.service';

import { CreateBoardInput } from './dto/create-board.input';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';

@Resolver()
export class BoardsResolver {
  constructor(
    private readonly boardsService: BoardsService, //

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache, // 이걸로 레디스를 가져오는거임
  ) {}

  @Query(() => String, { nullable: true })
  async fetchBoards(): Promise<string> {
    // 1. 캐시에서 조회하는 연습
    const mycache = await this.cacheManager.get('qqq');
    console.log(mycache);

    // 2. 조회완료 메시지 전달
    return '캐시에서 조회 완료!!';
    // return this.boardsService.findAll(); // redis연습을 위해서 잠깐 주석 걸기
  }

  @Mutation(() => String)
  async createBoard(
    @Args('createBoardInput') createBoardInput: CreateBoardInput,
  ): Promise<string> {
    // 1. 캐시에 등록하는 연습
    // cache manager는 0이 영구저장 <> 아까 redis는 -1이 영구저장
    // ttl: 몇초 이렇게 넣으면 된다
    // 관련 내용은 nestjs 독스를 자주 보자
    await this.cacheManager.set('qqq', createBoardInput, { ttl: 5 });

    // 2. 등록완료 메시지 전달
    return '캐시에 등록 완료!!';

    // redis연습을 위해서 잠깐 주석 걸기
    // return this.boardsService.create({ createBoardInput });
  }
}
