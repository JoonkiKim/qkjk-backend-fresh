import { Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IProductsServiceCreate,
  IProductsServiceFindOne,
} from './interfaces/products-service.interfaces';

@Injectable()
export class ProductsService {
  constructor(
    // 서비스 안에서 서비스를 또 주입받는거라고 생각하면 되고, InjectRepository가 서비스의 Injectable의 역할을 한다고 생각하면 됨 -> resolver에서 productService를 주입받아서 사용하듯이, 밑에 create함수에서 productsRepository를 주입받아서 사용할 수 있는 것
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>, // // 여기서 Repository는 typeorm에서 정해주는 타입이고, Product테이블에 작업을 할거라고 선언해주는 것
    // 정리하면 Repository는 typeorm에서 DB에 CRUD작업을 할때 필요한 부분!  
  ) {}

  // 여러개 조회 -> fetchProducts에 연결
  findAll(): Promise<Product[]> {
    // 얘는 리턴값이 여러개이니까 배열에 리턴값을 담아준다
    return this.productsRepository.find();
  }

  // 한개 조회 -> fetchProduct에 연결
  // id조건 넣어주기
  findOne(
    { productId }: IProductsServiceFindOne, // 조회조건으로 들어오는 id에 대한 타입스크립트도 지정해주기
  ): Promise<Product> {
    return this.productsRepository.findOne({ where: { id: productId } });
  }

  create({ createProductInput }: IProductsServiceCreate): Promise<Product> {
    // create함수의 리턴타입은 테이블 타입대로 나올테니까 테이블 엔티티(Product)를 타입으로 해주면되는데, 저장하고 응답을 받아오는데까지 시간이 걸리니까 테이블 이름 앞에 Promise를 써줘야된다다
    const result = this.productsRepository.save({
      // save가 DB테이블에 저장해달라는 뜻
      // 왼쪽은 컬럼명, 오른쪽은 저장할 값
      //   이건 하드코딩하는 방식
      //   name: '마우스',
      //   description: '좋은 마우스',
      //   price: 3000,

      // 이렇게 스프레드 연산자를 넣어주면 한번에 각 컬럼에 인풋값을 넣어줄 수 있다
      ...createProductInput,
    });

    // 그럼 result안에는 뭐가 있을까?
    // result = {
    //     id: 'aklsdjflkaslfd',
    //     name: "마우스",
    //     description: '좋은 마우스',
    //     price: 3000
    // }

    // 이렇게 만든 result를 리턴해준다 -> 그러면 resolver의 this.productsService.create({ createProductInput }); 자리에 리턴값이 들어간다
    return result;

    // ** await를 해줘야 저장할때까지 기다릴 수 있지 않나?
    // Nestjs는 resolver로 넘어가서 this.productsService.create({ createProductInput }) 자리에서 return하기 전까지 처리가 안 끝나면 잠깐 기다린다 => await를 안해줘도 된다

    // <> express는 안되니까 await달아줘야된다
  }
}
