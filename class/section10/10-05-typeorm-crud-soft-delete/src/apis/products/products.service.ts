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

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  findOne({ productId }: IProductsServiceFindOne): Promise<Product> {
    return this.productsRepository.findOne({ where: { id: productId } });
  }

  create({ createProductInput }: IPoroductsServiceCreate): Promise<Product> {
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
      throw new HttpException(
        '이미 판매완료된 상품입니다',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async delete({ productId }: IProductsServiceDelete): Promise<boolean> {
    // 여기서 IProductsServiceDelete는 인자로 받아오는 productId에 대한 타입을 지정해주는 것

    // true false가 아래에서 리턴값으로 나가니까 함수의 리턴타입도 boolean으로 해준다. await를 쓰니까 Promise를 넣어준다
    //
    // 1. 실제로 데이터를 삭제해버리는 방법
    // 근데 실제 서비스에서는 히스토리 관리가 필요하기 때문에 데이터를 완전히 없애버리지는 않는다
    // const result = await this.productsRepository.delete({ id: productId });
    // delete와 save함수는 DB에 접속하러 가는 함수! <> create같은건 접속 안하는 함수
    // return result.affected ? true : false;
    // affected는 실제로 영향이 갔는지 안갔는지 알려주는거임, true가 돌아오면 삭제가 잘 된거고, false면 잘 안된거임

    // 2. 소프트 삭제 - isDeleted컬럼을 만들어서 활용
    // isDeleted가 true가 된 데이터가 있으면 그건 삭제되었다고 우리끼리 생각하자 라고 하는 방법이 있음
    // this.productsRepository.update({id:productId}, {isDeleted: true})

    // 3. 소프트 삭제 - deletedAt컬럼을 만들어서 활용
    // deletedAt컬럼의 초기값을 다 비워놓고 그게 채워져있으면 삭제가 되었다고 설정하는 방법, 삭제된 날짜까지 확인할 수 있는 방법이 있다
    // this.productsRepository.update({id:productId}, {isDeletedAt: new Date})

    // [typeorm이 제공해주는 삭제 기능]
    // 삭제하면 자동으로 deletedAt에 시간이 찍히고 그건 조회할때 빼고 조회된다
    // 4. 소프트 삭제(typeorm이 제공해주는 기능) - softRemove
    // this.productsRepository.softRemove({ id: productId });
    // 단점: id로만 조건을 걸어서 삭제 가능(name같은거로 조건을 못걸음)
    // 장점: 여러 id를 한번에 삭제가능 ex. .softRemove([{id: qqq}, {id: aaa}, {id: zzz}])

    // 5. 소프트 삭제(typeorm이 제공해주는 기능) - softDelete
    const result = await this.productsRepository.softDelete({ id: productId });
    // 장점: id말고 다른 컬럼명으로도 삭제가능
    // 단점: 한번에 여러개를 못지움

    // 여러개 한번에 지울때는 Remove쓰고, 일반적으로는 Delete쓴다
    // ** 이렇게 typeorm함수를 쓸때도 엔티티에 deletedAt컬럼을 만들어줘야된다!!

    return result.affected ? true : false; // 이것도 affected써준다

    // ** 이렇게 내장 함수를 쓰는 것의 장점은 조회할때 deleted가 된 레코드는 알아서 제외하고 조회된다. 직접 만들면 조회할때 deletedAt이 있는 레코드는 제외하도록 하나씩 조건을 써줘야해서 번거로웠는데, 이건 알아서 해준다!!
  }
}

// deleteProduct를 그래프큐엘에서 실행하면 DB에 deleteAt 시간이 찍히고, 이 상태에서 fetchProduct를 하면 삭제한 레코드를 뺴고 조회된다!
