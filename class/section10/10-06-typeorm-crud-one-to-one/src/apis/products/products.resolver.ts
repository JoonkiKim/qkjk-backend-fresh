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
    // 이제 여기서 받은 데이터에는 기존 createProduct값이랑 productSaleslocation값이 같이 들어가있다! CreateProductInput에 같이 넣어줬으니까!
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

  @Mutation(() => Boolean) deleteProduct(
    @Args('productId') productId: string,
  ): Promise<boolean> {
    return this.productsService.delete({ productId });
  }
}
