import { Module } from '@nestjs/common';
import { StarbucksModule } from './apis/boards/starbucks.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Starbucks } from './apis/boards/entities/starbucks.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    StarbucksModule,
    ConfigModule.forRoot(),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
    }),
    TypeOrmModule.forRoot({
      // @nestjs/config의 ConfigModule 사용해서 env를 불러와야된다!! 그리고 ConfigModule는 항상 process.env위쪽에 있어야 env가 인식된다
      type: process.env.DATABASE_TYPE as 'mysql', // type자리는 Union타입으로 들어가는 값이 정해져있는데, process.env.DATABASE_TYPE만 쓰면 스트링타입으로 들어가서 as 'mysql'를 통해 타입을 강제해준다
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT), // 여기도 env들어오는 값은 무조건 스트링인데, 여기는 숫자가 들어가야되니까 number로 변환해준다
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,

      database: process.env.DATABASE_DATABASE,

      entities: [Starbucks],
      synchronize: true,
      logging: true,
    }),
  ],
})
export class AppModule {}
