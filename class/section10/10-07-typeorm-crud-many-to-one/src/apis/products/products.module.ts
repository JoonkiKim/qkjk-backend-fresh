import { Module } from '@nestjs/common';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductSaleslocationsService } from '../productsSaleslocations/productsSaleslocations.service';
import { ProductSaleslocation } from '../productsSaleslocations/entities/productSaleslocation.entity';

// 조인해서 등록 및 조회를 하기 위해서는 imports부분에 DB를 등록해주고, provider부분에 service를 등록해줘야 product테이블의 서비스에서 각각을 사용할 수 있따!

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product, //
      ProductSaleslocation,
    ]),
  ],

  providers: [
    ProductsResolver, //
    ProductsService, //
    ProductSaleslocationsService,
  ],
})
export class ProductsModule {}
