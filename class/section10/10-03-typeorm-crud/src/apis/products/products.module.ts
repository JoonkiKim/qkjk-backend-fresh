// typeorm과 mysql을 통해서 실제로 DB에 데이터를 저장해보자
// DB와의 상호작용 핵심은 서비스 쪽에 있다

import { Module } from '@nestjs/common';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

@Module({
  imports: [
    // 데이터를 넣어주기 위한 의존성을 주입해준다다
    TypeOrmModule.forFeature([
      Product, // 여기서 테이블을 정해주고 service부분에서 repository라는 이름으로 받아준다 => repository가 DB에 접속 조회 등록해주는 역할이다
    ]),
  ],

  providers: [
    ProductsResolver, //
    ProductsService,
  ],
})
export class ProductsModule {}
