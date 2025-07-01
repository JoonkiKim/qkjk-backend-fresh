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
    @Args('createProductInput') createProductInput: CreateProductInput,
  ): Promise<Product> {
    return this.productsService.create({ createProductInput });
  }

  @Mutation(() => Product)
  updateProduct(
    // 수정API에서는 수정할 상품의 ID와 수정할 내용을 알려줘야된다
    // 이때 수정'할'내용은 하나의 '객체'에 담아서 전달한다 -> CreateProductInput dto에 PartialType을 달아서 상속한 다음에 UpdateProductInput dto를 만들어준다
    @Args('productId') productId: string,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    return this.productsService.update({ productId, updateProductInput });
  }
}
