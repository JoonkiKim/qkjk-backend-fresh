// 삭제하기 API를 여기서 만들고, 구체적인 삭제 로직은 service에서 만든다

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { CreateProductInput } from './dto/create-product.input';
import { Product } from './entities/product.entity';
import { UpdateProductInput } from './dto/update-product.input';

@Resolver()
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => [Product]) fetchProducts(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Query(() => Product) fetchProduct(
    @Args('productId') productId: string,
  ): Promise<Product> {
    return this.productsService.findOne({ productId });
  }

  @Mutation(() => Product)
  createProduct(
    @Args('CreateProductInput') createProductInput: CreateProductInput,
  ): Promise<Product> {
    return this.productsService.create({ createProductInput });
  }

  @Mutation(() => Product)
  updateProduct(
    @Args('productId') productId: string,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    return this.productsService.update({ productId, updateProductInput });
  }

  @Mutation(() => Boolean) // 리턴타입이 true false니까 그래프큐엘 타입도 Boolean으로 적어준다
  deleteProduct(
    @Args('productId') productId: string, // 뭘 삭제할지 알려주기 위해 id를 넘겨준다
  ): Promise<boolean> {
    // true false가 아래에서 리턴값으로 나가니까 함수의 리턴타입도 boolean으로 해준다. 서비스에서 오는 응답을 기다려주니까 Promise를 넣어준다. 근데!! nestjs는 await를 안쓰고도 resolver의 return부분에서 await를 알아서 실행해준다고 했었음!! 그니까 따로 await를 안쓴다
    return this.productsService.delete({ productId }); // 안전한 코드를 만들기 위해 중괄호에 감싸서 보내준다. 이렇게 보내면 뒤쪽에서 받는 productId라는 이름과도 똑같아야 에러가 안뜨기 때문에 변수명을 달라지게 못하므로 더 안전하다
  }
}
