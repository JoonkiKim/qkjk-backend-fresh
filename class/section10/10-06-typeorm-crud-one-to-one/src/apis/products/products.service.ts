import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPoroductsServiceCreate,
  IProductServiceCheckSouldOut,
  IProductServiceUpdate,
  IProductsServiceDelete,
  IProductsServiceFindOne,
} from './interfaces/products-service.interfaces';
import { ProductSaleslocationsService } from '../productsSaleslocations/productsSaleslocations.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly productsSaleslocationsService: ProductSaleslocationsService, // 이 의존성은 레파지토리가 아니라 ProductSaleslocations테이블의 서비스에서 주입받는거니까 ProductSaleslocationsService를 넣어준다 // module쪽에도 ProductSaleslocationsService을 선언해줘야 이쪽 서비스에서 주입받아서 쓸 수 있다!
  ) {}

  // [다른 테이블과 조인해서 데이터 조회하는 방법]
  findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['productSaleslocation'], // 여기에 조인하고 싶은 테이블 이름을 적어주면 조인해서 가져와진다
    });
  }
  findOne({ productId }: IProductsServiceFindOne): Promise<Product> {
    return this.productsRepository.findOne({
      where: { id: productId },
      relations: ['productSaleslocation'], // 여기도 조인하고 싶은 테이블 이름을 적어주면 조인해서 가져와진다
    });
  }

  async create({
    createProductInput,
  }: IPoroductsServiceCreate): Promise<Product> {
    // 1. 상품(Product)의 내용만 등록할때 사용하는 방법
    // const result = this.productsRepository.save({
    //   ...createProductInput,
    // });

    // [2. 상품(Product)과 상품거래위치(ProductSaleslocation) 데이터를 한번에 같이 등록하는 방법]
    // 우선 createProductInput안에 두 데이터가 함께 있는데, 이걸 분리해줘야됨 => rest파라미터를 활용한다. rest파라미터 이름은 바꿀 수 있으니까 (...product)로 써준다 => 이 안에는 name,description,price만 들어있고, 나머지는 productSaleslocation안에 있다
    const { productSaleslocation, ...product } = createProductInput;

    // 이렇게 쪼갠 데이터를 각각 productsSaleslocation테이블과 product테이블에 저장해준다. 근데 각각 저장만 해주면 그 두개가 연결되어있지는 않은거임. 따라서 productSaleslocation에 저장하고 나서 생성된 id를 product테이블에 같이 넣어줘야 연결이 된다
    // id를 보내주려면 그 작업이 끝나고 다음으로 넘어가야되니까 await를 붙여준다

    // ** 근데 productsSaleslocation에 대한 저장을 여기서 하는게 맞나? => 아님. 여기서 할수도 있지만 안정성때문에 안하는거임. 왜냐면 productsSaleslocation 데이터 등록 작업을 다른데에서도 할 수 있는데 이렇게 코드를 하나씩 써버리면 뭐 하나 빠뜨릴 수 있는 위험이 있음. => 검증로직의 통일을 위해 다른데에서 작업을 하고 여기서 받아서 쓴다 (여기저기서 상품거래위치의 레파지토리에 접근하면 검증로직을 통일시킬 수 없음)
    // "검증 및 저장 등의 로직은 각 테이블의 서비스에서 한다"는 원칙에 따라 아래의 코드는 productsSaleslocation의 service에서 작성해준다
    // const result = await this.productsSaleslocationRepository.save({
    //   ...productSaleslocation,
    // });

    // 위의 코드를 아래의 의존성 주입 방법을 통해 수행한다!!
    const result = await this.productsSaleslocationsService.create({
      ...productSaleslocation,
    });

    const result2 = this.productsRepository.save({
      ...product,
      productSaleslocation: result,
      // 
      // id만 연결하면 등록된 상품 데이터와 상품거래위치 데이터 모두의 결과를 받을 수가 없으니까 그냥 위쪽의 result전체를 같이 넣어준다. 이때 생성된 내용은 dto가 아니라 entity에 따라 생성되니까 거래위치의 id가 포함되어있다!
      // productSaleslocation: {
      //   // id: result.id,
      // },
    });

    return result2;
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
      throw new HttpException(
        '이미 판매완료된 상품입니다',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async delete({ productId }: IProductsServiceDelete): Promise<boolean> {
    const result = await this.productsRepository.softDelete({ id: productId });

    return result.affected ? true : false;
  }
}
