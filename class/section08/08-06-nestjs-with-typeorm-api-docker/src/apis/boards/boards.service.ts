import { Injectable } from '@nestjs/common/decorators';
import { Board } from './entities/board.entity';
import { IBoardsServiceCreate } from './interfaces/boards-service.interface';
import { Scope } from '@nestjs/common';

@Injectable({ scope: Scope.DEFAULT })
export class BoardsService {
  findAll(): Board[] {
    // 아래의 객체들은 Board라는 테이블 형태이고, 이게 배열형태로 들어가있으니까 Board라는 배열 이라는 뜻의 Board[]로 findAll함수의 타입을 지정해준다
    // 1. DB에서 데이터 조회하기
    const result = [
      {
        number: 1,
        writer: '철수',
        title: '제목입니다',
        contents: '내용입니다',
      },
      {
        number: 2,
        writer: '영희',
        title: '제목입니다',
        contents: '내용입니다',
      },
      {
        number: 3,
        writer: '훈이',
        title: '제목입니다',
        contents: '내용입니다',
      },
    ];

    // 2. DB에서 꺼내온 결과를 브라우저에 응답주기
    return result;
  }

  // create(writer: string, title: string, contents: string): string // 따로따로 받는 방법

  // 묶어서 받는 방법
  create({ createBoardInput }: IBoardsServiceCreate): string {
    // 1. 브라우저에서 보내준 데이터 확인하기

    // 이 콘솔은 터미널에서 보이는 로그이고 아래에 return '게시물 등록에 성공하였습니다'는 브라우저쪽에 보내주는거임
    console.log(createBoardInput.writer);
    console.log(createBoardInput.title);
    console.log(createBoardInput.contents);

    // 2. DB에 접속 후 거기에 데이터를 저장 => 데이터 저장했다고 가정하기

    // 3. DB에 저장된 결과를 브라우저에 응답 주기
    // 여기서는 resolver에 응답을 주는거고 this.boardsService.create(writer, title, contents);자리에 응답이 들어감, 따라서 거기서 또 브라우저에 리턴을 줘야됨
    return '게시물 등록에 성공하였습니다';
  }
}

// Mysql에서 dto, entity는 몽고디비에서의 스키마 역할을 하는거니까 각각 타입스크립트와 그래프큐엘을 위한 타입을 지정해줘야됨 (서버 -> 디비 방향으로 데이터가 가는거임)
// 근데 각 input값에 대한 타입스크립트를 따로 지정해주는 이유는 브라우저에서 서버로 넘어오는 데이터에 대한 타입을 지정해주기 위함인거임, 이걸 해주는 이유는 데이터타입을 명확히 해서 지뢰를 제거한다는 타입스크립트의 의도를 따름
