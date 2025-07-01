import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IProductsServiceCreate,
  IProductServiceCheckSouldOut,
  IProductServiceUpdate,
  IProductsServiceDelete,
  IProductsServiceFindOne,
} from './interfaces/products-service.interfaces';
import { ProductSaleslocationsService } from '../productsSaleslocations/productsSaleslocations.service';
import { ProductsTagsService } from '../productsTags/productsTags.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly productsSaleslocationsService: ProductSaleslocationsService,
    private readonly productsTagsService: ProductsTagsService, // 태그 서비스 만들어서 여기서 주입해준다
  ) {}

  findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['productSaleslocation', 'productCategory', 'productTag'],
    });
  }
  findOne({ productId }: IProductsServiceFindOne): Promise<Product> {
    return this.productsRepository.findOne({
      where: { id: productId },
      relations: ['productSaleslocation', 'productCategory', 'productTags'],
      // 조인하고 싶으면 테이블 이름 가져오면 되는데, 이때 product '엔티티'에서 해당 테이블을 선언한 컬럼명으로 가져오면 된다! 
    });
  }

  async create({
    createProductInput,
  }: IProductsServiceCreate): Promise<Product> {
    // productTags를 createProductInput에서 분리해준다
    const { productSaleslocation, productCategoryId, productTags, ...product } =
      createProductInput;

    // 1. 상품거래위치를 상품거래위치 테이블에 등록
    const result = await this.productsSaleslocationsService.create({
      productSaleslocation,
    });

    // 2. 상품태그를 상품 테이블과 연결
    // "태그를 각각 등록하고 그 id를 배열형태로 받아서 상품 테이블에 등록하면 된다"

    // productTags가 ["#전자제품","#영등포", "#컴퓨터"] 같은 형태로 들어온다고 해보자
    const tagNames = productTags.map((el) => el.name.replace('#', ''));
    // 태그 앞에 있는 #을 없애주기
    // 이때 productTags타입이 ProductTag[]니까 그 안에 들어있는게 id일수도 있고 name일수도 있음 -> el.name으로 명시해줘서 replace가 문자열에 대해 작업을 수행할 수 있게 선언해줌

    // 만약 기존에 저장되어있는 태그라면 또 저장하는게 비효율적이니까, 중복되는 태그는 삭제해준다

    // 2-1. 일단 여기서 기존 태그들을 조회해준다
    // 근데 조회할때 Repository를 쓰게 되니까 여기가 아니라 productsTags의 service에서 만들어서 주입받는다!!
    // const prevTags = await this.productsTagsRepository.find({
    //   where: { name: In(productTags) }, // In을 써주면 productTags배열 안에 있는 모든 애들을 조건으로 넣고 비교하게 됨
    // });
    const prevTags = await this.productsTagsService.findByNames({ tagNames });
    // **prevTags에는 기존 값들의 id와 name이 같이 들어온다
    // tagname를 넘겨줄때는 안정성을 위해 중괄호 넣어서 넘겨준다

    // 2-2. 새로 입력받은 태그에서 기존 태그를 빼준다
    // forEach로 반복문을 돌려서 배열 속의 태그를 하나씩 비교해준다
    // 새로들어온 태그 내용을 el로 두고, 기존 값을 prevEl로 둔 다음에 하나씩 비교해서 겹치는지 확인해본다
    const temp = []; // temp는 안겹치는 태그를 담아주기 위해 잠시 만들어놓은 배열
    tagNames.forEach((el) => {
      const isExits = prevTags.find((prevEl) => el === prevEl.name);
      // isExits가 false가 나오면 안 겹친다는 뜻이니까 temp배열에 안겹치는 태그를 담아준다
      if (!isExits) temp.push({ name: el });
    });

    // 태그들을 상품태그 테이블에 저장하기
    // 배열을 for문으로 돌려서 각각 DB에 레코드를 저장하는 방법도 있지만, 그러면 성능이 오래걸리니까 bulkinsert를 통해 한번에 저장하자. insert안에 '배열'이 들어가있으면 bulkinsert라고 한다. save로는 불가능함
    // this.productsTagsRepository.insert(temp); 이 계산을 하고 나면, 저장된 각 태그들의 id를 newTags에 모두 담아올 수 있다
    // temp에는 겹치치 않는 새로운 태그들만 들어가있다
    // const newTags = await this.productsTagsRepository.insert(temp); // 여기도 insert함수를 여기서 만드는게 아니라 Tags의 서비스에서 만든다
    const newTags = await this.productsTagsService.bulkInsert({ names: temp }); // 다만 productsTagsService에서 temp라는 이름으로 받는게 좀 안어울리니까 names라는 이름으로 보내준다
    // 근데 newTags에서 구체적인 태그이름은 못 받아옴. id밖에 못받아옴
    // 여기서는 그럼 왜 id밖에 못받냐?bulkInsert함수를 구성하고 있는 insert함수의 특성 때문에 identifier를 통한 id추출만 가능하고 name은 못받기 때문!!

    // 아까는 새로운 태그를 태그 테이블에 저장하는 과정이었고, 여기는 상품테이블에 연결해주는거니까 input값으로 들어온 모든 태그들을 합쳐준다
    const tags = [...prevTags, ...newTags.identifiers];
    // insert함수는 save함수와 달리 등록된 값을 반환하지 않기 때문에, idenfiters를 통해 id값을 사용할거라고 명시해줘야됨
    // prevTags는 id랑 name이 다 같이 들어가있는데, newTags.identifiers는 id만 들어가 있다
    // 그래서 플레이그라운드에서 기존값만으로 name요청을 하면 name이 나오는데, 새로운 입력값을 포함해서 name을 요청하면 안나온다 => id만 있는게 있고 name이 같이 있는게 있는거다

    // 여기서 드디어 product랑 tags랑 합쳐주는거임
    // 상품테이블이랑 상품태그테이블이 연결되기 위해 중간테이블이 하나 생성되고 거기서 id로 조인이 되는거임
    const result2 = await this.productsRepository.save({
      ...product,
      productSaleslocation: result,
      // 카테고리 id를 상품 테이블에 등록
      productCategory: {
        id: productCategoryId,
      },
      // 태그id와 name을 상품 테이블에 등록(대신 새로운 값은 name을 못받고, 기존값만 name을 받을 수 있다)
      productTags: tags,
      // 여기에 태그들의 name과 id들이 배열로 들어가있다, 다대다 관계이니까 여러개가 하나의 레코드에 들어가는 것처럼 보이는게 말이됨!
    });
    console.log(tags);
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

// [막힌 부분]

// prevTag에 왜 id가 들어가지? 태그가 들어가야되는거 아님?
// bulkinsert에서 사용하는 insert함수의 특성상 identifier를 통한 id만 리턴으로 받을 수 있고, name을 받을 수가 없음!! , 그래서 id만 리턴값이 나왔던거였음
