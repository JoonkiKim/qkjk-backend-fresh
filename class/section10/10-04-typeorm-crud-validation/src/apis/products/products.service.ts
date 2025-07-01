import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPoroductsServiceCreate,
  IProductServiceCheckSouldOut,
  IProductServiceUpdate,
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
    // const product = await this.productsRepository.findOne({
    //   where: { id: productId }, // 이 부분으로 아래에서 필요한 조회를 해주는거임
    // });

    // ** 근데! 위에처럼 this.productsRepository.findOne을 매번 새로 써버리면 로직이 많아지는 경우 로직을 수정해야될때 하나씩 다 수정해야해서 빼먹을 수 있다. 따라서 이런 조회 로직도 하나 만들어놓은것을 재사용하는게 좋다. 위에서 만든 findOne함수를 재사용해서 가져온다
    const product = await this.findOne({ productId });

    // 데이터 검증 부분도 매번 이 코드 자체를 가져다가 쓰면 수정해야되는경우 빼먹을 수 있어서 위험하니까, 따로 하나 빼서 checkSoldtOut함수를 만들어주고 그걸 가져다가 쓴다
    this.checkSoldOut({ product });

    // <try-catch 구문>
    // 검증로직 관련된게 아니라 DB관련 문제 등 예상치 못한 에러가 발생하면 그건 try-catch 구문으로 에러를 잡아준다
    // 어딘가에서 에러가 발생하면, 그 코드 밑으로는 실행하지 않고 바로 catch로 건너뛴다
    // 근데!! 그럼 save함수가 있을때마다 매번 try-catch를 달아버리면 너무 달아야할게 많다 -> exception-filter를 사용해서 검증해야되는 부분을 하나의 파일로 만들어서 한번에 처리한다
    // commons파일에 filter 부분에 가면, HttpExceptionFilter가 만들어져있는데 이게 전체 코드에 적용되면서 '에러를 만나면 try-catch구문처럼 작동' 하게 된다.
    // 아까 nestjs독스에서 봤던 request lifecycle를 보면, 19번에 exception filter가 있는데 지금 만든 파일이 그 역할을 하는거임

    // [수정하기 함수]
    // 등록, 수정 모두 save로 한다
    // 이때 save내용안에 id가 없으면 등록, 있으면 수정이다
    const result = this.productsRepository.save({
      // 업데이트 이후에 수정된값&기존값을 모두 보여주기 위해 수정 안된 값은 조회를 해서 보여주고 수정된 값은 그 값을 보여준다. 그러면 product를 통해 조회한걸 하나씩 써주고 그 밑에 updateProductInput을 하나씩 써줘서 수정한 값들을 써주면, 객체에서 중복 선언된건 덮어씌워지니까 순서대로 써주면 되는데 => ...product, ...updateProductInput 으로 스프레드해서 써주면 코드가 아주 깔끔하다
      // 각 상품 id도 ...product, ...updateProductInput 안에 포함되어있으니까 그냥 ...product, ...updateProductInput만 써주면 된다
      ...product, // 이게 있어야 수정하지 않은 값도 return으로 받아올 수 있다
      ...updateProductInput,
    });

    return result;

    // 사실 this.productsRepository.create, insert, update가 있지만 insert, update는 등록을 한 뒤에 그 결과를 받아오지 않음 <> save는 등록&수정한 결과를 받아옴 => 결과를 넘겨주기 위해 save를 사용한다
    // 결과를 굳이 브라우저에 안 보내줘도 될때는 insert, update를 쓰는게 효율적이다
    // 그리고 create는 DB 접속이랑 관련없고, 등록을 위해서 빈 껍데기 객체를 하나 만드는거다
  }

  // ** checkSoldOut을 함수로 만드는 이유 => 수정, 삭제 등 여러 작업을 할때 똑같은 검증로직을 사용하기 위해서!!
  // 이렇게 데이터를 검증하는 로직은 함수로 따로 만들어놓고 재사용을 하는게 좋다. 코드를 매번 새로 써주는게 아니라!!
  checkSoldOut({ product }: IProductServiceCheckSouldOut) {
    // [수정하기 전에 조회된 데이터를 검증하는 부분]
    // if (product.isSoldout) {
    //   // isSoldout=true이면 이미 판매된 상품이니까, 뭘 수정하면 안됨
    //   // 따라서 뭘 수정하려고 했는데 이미 판매된 상황이므로 예외처리해준다, 메시지를 써주고 뒤에 숫자로 http상태코드를 보내줘야되는데 이건 프론트엔드 개발자가 보게되는 부분이니까 백엔드 개발자가 알아서 정하면 됨. 그리고 숫자를 다 외우기 힘드니까 문자로 써주면 숫자로 변환되어서 날라간다
    //   // throw new HttpException(
    //   //   '이미 판매완료된 상품입니다',
    //   //   HttpStatus.UNPROCESSABLE_ENTITY,
    //   // );
    // }
    // 아래처럼 통째로 해당 상태코드를 보내주는 방법도 있음
    if(product.isSoldout) {
      throw new UnprocessableEntityException("이미 판매완료된 상품입니다")
    }
  }
}

// ** '검증'은 어디서 하나?? => 서비스에서 한다!!
// 서비스에서도 할수있고, 컨트롤러에서도 할 수 있는데 서비스에서 한다
// 재사용을 하게 되는경우 코드를 빼먹는 위험을 방지하기 위해!!
