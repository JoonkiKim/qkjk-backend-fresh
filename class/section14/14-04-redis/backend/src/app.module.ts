import { CacheModule, Module } from '@nestjs/common';
import { BoardsModule } from './apis/boards/boards.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './apis/products/products.module';
import { ProductsCategoriesModule } from './apis/productsCategories/productsCategories.module';
import { UsersModule } from './apis/users/users.module';
import { AuthModule } from './apis/auth/auth.module';
import { PointsTransactionsModule } from './apis/pointsTransactions/pointsTransactions.module';
import { PaymentsMoudle } from './apis/payments/payments.module';
import { FilesModule } from './apis/files/files.module';

import { CacheConfigService } from './commons/libraries/cacheConfig.service';

@Module({
  imports: [
    AuthModule,
    BoardsModule,

    FilesModule,
    PointsTransactionsModule,
    PaymentsMoudle,
    ProductsModule,
    ProductsCategoriesModule, //
    UsersModule,
    ConfigModule.forRoot(),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,

      database: process.env.DATABASE_DATABASE,

      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
    CacheModule.registerAsync({ isGlobal: true, useClass: CacheConfigService }), // 여기서 isGlobal: true를 설정해주면, 전역에서 캐시를 사용할 수 있게 된다!
  ],
})
export class AppModule {}
