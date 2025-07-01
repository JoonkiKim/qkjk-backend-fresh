import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { ProductDetail } from './entities/productDetail.entity';

@Injectable()
export class ProductsDetailsService {
  constructor(
    @InjectRepository(ProductDetail)
    private readonly productsDetailsRepository: Repository<ProductDetail>,
  ) {}

  create({ ...productsDetail }) {
    return this.productsDetailsRepository.save({
      ...productsDetail,
    });
  }

  async update({
    productDetailId,
    updateProductDetailInput,
  }: {
    productDetailId: string;
    updateProductDetailInput: Partial<ProductDetail>;
  }): Promise<ProductDetail> {
    await this.productsDetailsRepository.update(
      productDetailId,
      updateProductDetailInput,
    );
    return this.productsDetailsRepository.findOne({
      where: { id: productDetailId },
    });
  }
}
