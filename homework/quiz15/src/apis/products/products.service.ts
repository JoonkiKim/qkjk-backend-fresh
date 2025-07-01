import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IProductServiceCheckSouldOut,
  IProductServiceUpdate,
  IProductsServiceCreate,
  // IProductServiceUpdate,
  IProductsServiceDelete,
  IProductsServiceFindOne,
} from './interfaces/products-service.interfaces';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  // [다른 테이블과 조인해서 데이터 조회하는 방법]
  findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      // relations: ['productSaleslocation'], // 여기에 조인하고 싶은 테이블 이름을 적어주면 조인해서 가져와진다
    });
  }
  findOne({ productId }: IProductsServiceFindOne): Promise<Product> {
    return this.productsRepository.findOne({
      where: { id: productId },
      // relations: ['productSaleslocation'], // 여기도 조인하고 싶은 테이블 이름을 적어주면 조인해서 가져와진다
    });
  }

  create({ createProductInput }: IProductsServiceCreate): Promise<Product> {
    const result = this.productsRepository.save({
      ...createProductInput,
    });

    return result;
  }

  async update({
    productId,
    updateProductInput,
  }: IProductServiceUpdate): Promise<Product> {
    const product = await this.findOne({ productId });

    this.checkSoldOut({ product });

    const result = this.productsRepository.save({
      ...product,
      ...updateProductInput,
    });

    return result;
  }

  checkSoldOut({ product }: IProductServiceCheckSouldOut) {
    if (product.isSoldout) {
      throw new UnprocessableEntityException('이미 판매완료된 상품입니다');
    }
  }

  async delete({ productId }: IProductsServiceDelete): Promise<boolean> {
    const result = await this.productsRepository.softDelete({ id: productId });

    return result.affected ? true : false;
  }
}
