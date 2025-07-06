import { Injectable, Scope } from '@nestjs/common';
import { Board } from './entities/board.entity';
import { IBoardsServiceCreate } from './interfaces/boards-service.interface';

@Injectable({ scope: Scope.DEFAULT })
export class BoardsService {
  findAll(): Board[] {
   
    // 1. DB에서 데이터 조회하기
    const result = [
      {
        number: 1001,
        writer: '철수',
        title: '제목입니다',
        contents: '내용입니다',
      },
      {
        number: 2001,
        writer: '영희',
        title: '제목입니다',
        contents: '내용입니다',
      },
      {
        number: 3001,
        writer: '훈이',
        title: '제목입니다',
        contents: '내용입니다',
      },
    ];

    // 2. DB에서 꺼내온 결과를 브라우저에 응답주기
    return result;
  }

  create({ createBoardInput }: IBoardsServiceCreate): string {
    // 1. 브라우저에서 보내준 데이터 확인하기

    console.log(createBoardInput.writer);
    console.log(createBoardInput.title);
    console.log(createBoardInput.contents);

    // 2. DB에 접속 후 거기에 데이터를 저장 => 데이터 저장했다고 가정하기

    // 3. DB에 저장된 결과를 브라우저에 응답 주기
   
    return '게시물 등록에 성공하였습니다';
  }
}

