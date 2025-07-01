import { Module } from '@nestjs/common';
import { BoardsModule } from './apis/boards/boards.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    BoardsModule,
    // ProductsModule,
    // UsersModule
    // 이렇게 각 API의 모듈을 APP모듈에서 합쳐준다 -> 이게 main.ts로 가서 실행된다,

    // 그래프큐엘을 실행시키기 위해 GraphQLModule도 가져와야 된다
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // autoSchemaFile을 통해 자동으로 스키마 파일을 생성해줄 경로를 지정해준다 => code-first 방식
      autoSchemaFile: 'src/commons/graphql/schema.gql',
    }),
  ],
  // 그래프큐엘에서 app.module은 컨트롤러, 프로바이더를 사용하지 않는다 <> apis 폴더내 boards.module같은 모듈은 provider를 사용한다
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
