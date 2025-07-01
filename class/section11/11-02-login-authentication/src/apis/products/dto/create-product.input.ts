import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { ProductSaleslocationInput } from 'src/apis/productsSaleslocations/dto/product-saleslocation.input';
import { ProductTagInput } from 'src/apis/productsTags/dto/product-tag.input';
import { ProductTag } from 'src/apis/productsTags/entities/productTag.entity';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Min(0)
  @Field(() => Int)
  price: number;

  @Field(() => ProductSaleslocationInput)
  productSaleslocation: ProductSaleslocationInput;

  @Field(() => String)
  productCategoryId: string;

  // ProductTagInput으로 바꿔 사용
  @Field(() => [ProductTagInput], { nullable: true })
  productTags?: ProductTagInput[];
}
