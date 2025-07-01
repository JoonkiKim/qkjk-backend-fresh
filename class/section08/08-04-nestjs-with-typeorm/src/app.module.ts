// Nestjs와 mysql을 연결하고 typeORM을 통해서 데이터를 주고 받아보자


import { Module } from '@nestjs/common';
import { BoardsModule } from './apis/boards/boards.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './apis/boards/entities/board.entity';

@Module({
  imports: [
    BoardsModule,

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
    }),
    // 아래의 부분이 nestjs랑 mysql을 연결해주는 코드
    TypeOrmModule.forRoot({
      type: 'mysql', // 데이터베이스의 종류 (ex. postgres, mysql, oracle 등등)

      host: 'localhost', // 도커 연결할때는 host 이름을 네임리졸루션에 따라 도커 이름으로 넣어줘야된다
      port: 3306,
      username: 'root',
      password: '15080679',

      database: 'myproject', // Mysql안에서 특정 데이터베이스에 접속하는 코드인데, 그 데이터베이스를 만들어주고 여기다 써야된다
      // [MySQL에서 DB만드는 법]
      // 접속후에 mysql선택하고 Databases에서 우클릭 후 create New databases

      entities: [Board], // 여기가 스키마를 정의해주는 곳임. 이때 이름은 테이블 이름 적어주는거임, entity에서 만들어준 class를 여기에 써주면 된다. 이 부분이 몽고디비에서 models를 만들어주고 연결해주는 부분.
      synchronize: true, // 이걸 켜줘야 디비버랑 vscode가 연동된다
      logging: true, // 몽구스 쓸때 debug로 ODM의 자세한 명령어를 봤듯이, logging을 통해 ORM의 자세한 명령어를 확인할 수 있따
    }),
  ],
})
export class AppModule {}

// [게시판 API만들기]
// 몽고디비에서는 models를 만들었던 것처럼 여기서는 테이블 구조를 정의하기 위해 entities를 만들어준다
// 여기들어가는 파일명에는 기본적으로 s를 다 빼준다! 왜냐면 이 자체가 테이블 이름이 될거니까 거기에 s가 들어가면 안되기 때문에
// 엔티티 관련 코드는 board.entity.ts에서 보면 되고
// 다 만들었으면 yarn start:dev로 서버 실행해주면 됨
// 오래 걸린다면 참을성을 갖고 기다리자... => 어차피 도커패키징하고 나면 yarn start:dev는 쓸일 없다

// [몽구스(ODM)과 typeORM의 차이점]
// 몽구스에서 models에서 선언한 스키마에 따라 데이터를 입력할 수 있고 그 이외의 데이터는 못 집어넣지만, 몽고디비에 직접 데이터를 넣으면 스키마 이외의 데이터가 들어갈 수 있었음 => 스키마리스 , 좀 더 유연하다
// 하지만, mysql은 테이블 구조가 딱 잡혀있기 때문에, 디비에 직접 데이터를 넣는 방법도 사용할 수 없다! 명확하게 스키마가 존재하는 구조이다! => 스키마 존재, 좀 더 안전하다
