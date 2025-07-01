import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductSaleslocation } from './entities/productSaleslocation.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductSaleslocationsService {
  // product테이블에서 Repository의존성 주입받는 것과 동일하게 여기서도 ProductSaleslocation으로 Repository의존성 주입받아서 테이블에 저장한다음에 그 결과값을 productsSaleslocationsService통해서 product테이블에 보내준다
  constructor(
    @InjectRepository(ProductSaleslocation)
    private readonly productsSaleslocationRepository: Repository<ProductSaleslocation>,
  ) {}

  create({ ...productSaleslocation }) {
    return this.productsSaleslocationRepository.save({
      ...productSaleslocation,
    });
  }
}
