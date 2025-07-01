import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImagesResolver } from './productImages.resolver';
import { ProductImagesService } from './productImages.service';
import { ProductImage } from './entities/productImage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductImage, // ✅ ProductImage 엔티티 등록
    ]),
  ],
  providers: [
    ProductImagesResolver, //
    ProductImagesService,
  ],
  exports: [ProductImagesService], // ✅ 다른 모듈에서 주입받을 수 있도록 공개
})
export class ProductImagesModule {}
