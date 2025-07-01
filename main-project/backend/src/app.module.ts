import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './apis/products/products.module';
import { ProductsCategoriesModule } from './apis/productsCategories/productsCategories.module';
import { StoresModule } from './apis/stores/stores.module';
import { UsersModule } from './apis/users/users.module';
import { AuthModule } from './apis/auth/auth.module';
import { PaymentsModule } from './apis/payments/payment.module';
import { ProductImagesModule } from './apis/productsImages/productImages.module';
import * as redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';

@Module({
  imports: [
    ProductsModule,
    ProductsCategoriesModule, //
    ProductImagesModule,
    StoresModule,
    PaymentsModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot(),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      formatError: (error) => {
        console.log('에러 받았다~');
        console.log(error);
        return error;
      }, // 아폴로 에러를 받을 일이 없는경우에는 formatError는 없애줘도 된다
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
    // CacheModule.registerAsync({ isGlobal: true, useClass: CacheConfigService }), // 여기서 isGlobal: true를 설정해주면, 전역에서 캐시를 사용할 수 있게 된다!
    CacheModule.register<RedisClientOptions>({
      // 추가
      store: redisStore as unknown as any, // 타입 단언
      url: 'redis://my-redis:6379',
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
