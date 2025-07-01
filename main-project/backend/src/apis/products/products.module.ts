import { Module } from '@nestjs/common';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductDetail } from '../productsDetails/entities/productDetail.entity';
import { ProductsDetailsService } from '../productsDetails/productsDetails.service';
import { Allergy } from '../allergies/entities/allergy.entity';
import { AllergiesService } from '../allergies/allergies.service';
import { ProductImagesModule } from '../productsImages/productImages.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product, //
      ProductDetail,
      Allergy,
    ]),
    ProductImagesModule,
  ],

  providers: [
    ProductsResolver, //
    ProductsService, //
    ProductsDetailsService,
    AllergiesService,
  ],
})
export class ProductsModule {}
