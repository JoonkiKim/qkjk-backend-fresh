import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, InsertResult, Repository } from 'typeorm';
import { ProductTag } from './entities/productTag.entity';
import {
  IProductsTagsServiceBulkInsert,
  IProductsTagsServiceFindByName,
} from './interfaces/products-tags-service.interface';

@Injectable()
export class ProductsTagsService {
  constructor(
    @InjectRepository(ProductTag)
    private readonly productsTagsRepository: Repository<ProductTag>,
  ) {}

  // In쿼리를 통해서 name으로 조건을 만들어서 조회를 하니까 ByNames이라는 이름을 붙여준다
  findByNames({
    tagNames,
  }: IProductsTagsServiceFindByName): Promise<ProductTag[]> {
    return this.productsTagsRepository.find({
      where: { name: In([...tagNames]) },
      // In을 써주면 tagNames배열 안에 있는 모든 애들을 조건으로 넣고 비교하게 됨

      // 이거의 '결과'로 기존 값의 id,name을 받을 수 있음(리턴값의 타입에 따라)
    });
  }

  // 한번에 넣는 bulkInsert니까 이름을 이렇게 해준다
  bulkInsert({ names }: IProductsTagsServiceBulkInsert): Promise<InsertResult> {
    return this.productsTagsRepository.insert([...names]);
    // insert안에 배열이 들어가있으면 bulk insert
    // bulk-insert는 save()로 불가능
  }
  // 이거의 '결과'로 새로 저장된 id를 받을 수 있음(InsertResult의 identifier타입을 통해)
}
