import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { CreateProductInput } from './dto/create-product.input';
import { Product } from './entities/product.entity';

@Resolver()
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService, //
  ) {}

  @Query(() => [Product]) // 쿼리의 그래프큐엘 리턴타입도 여러개가 들어오니까 배열로 해주기기
  // 여러개 조회
  fetchProducts(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Query(() => Product) // 얘는 하나니까 그냥 테이블 엔티티 이름 적어주기
  // 한개 조회
  // 특정 id로 조회하기 위해 productId 조건 넣어주기
  fetchProduct(@Args('productId') productId: string): Promise<Product> {
    return this.productsService.findOne({ productId });
  }

  @Mutation(() => Product)
  // 뮤테이션에 대한 '그래프큐엘' 타입을 Product로 지정해준다. 입력을 할때도 테이블 스키마에 따라 할테니까 테이블 엔티티로 지정해준다
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ): Promise<Product> {
    // createProduct리턴타입도 테이블 엔티티 타입대로 생겼을테니까 Product라고 해주면된다. 그리고 얘도 받아오는데 시간이 걸리니까 promise를 넣어준다

    // ** 여기서 꼭 리턴을 또 해줘야 이게 브라우저까지 전달된다
    // <여기서 브라우저에 결과를 보내주는 2가지 방법>
    // 1. 이것처럼 등록된 내용이 담긴 객체를 그대로 브라우저에 보내주기 -> 보통 이걸 많이 쓴다. 등록된 내용이 뭔지 보기 위해 조회요청을 또 보내지 않고, 한번에 볼 수 있으니까
    return this.productsService.create({ createProductInput });

    // 2. 결과 메시지만 간단하게 보내주기
    // return '정상적으로 상품이 등록되었습니다'
  }
}
