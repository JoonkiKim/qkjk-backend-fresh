import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ProductImagesService } from './productImages.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver()
export class ProductImagesResolver {
  constructor(
    private readonly productImagesService: ProductImagesService, //
  ) {}

  // 이미지 여러개를 받는거니까 배열로 바꿔주자
  @Mutation(() => [String])
  uploadProductImages(
    @Args({ name: 'productImages', type: () => [GraphQLUpload] })
    productImages: FileUpload[],
  ): Promise<string[]> {
    return this.productImagesService.upload({ productImages });
  }
}
