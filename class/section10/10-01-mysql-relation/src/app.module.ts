import { Module } from '@nestjs/common';
import { BoardsModule } from './apis/boards/boards.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    BoardsModule,
    ConfigModule.forRoot(),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,

      database: process.env.DATABASE_DATABASE,

      entities: [__dirname + '/apis/**/*.entity.*'], // 여기서 형식을 ts로 하면 dist로 들어갔을때는 ts를 못찾기 때문에 뒤쪽 확장자는 *로 해준다 , 원래는 엔티티 이름으로 지정을 해줬었는데, 이제는 파일 확장자로 하면 전부 다 지정할 수 있게 된다
      synchronize: true,
      logging: true,
    }),
  ],
})
export class AppModule {}
