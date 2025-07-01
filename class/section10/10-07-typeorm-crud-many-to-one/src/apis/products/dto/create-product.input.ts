import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { ProductSaleslocationInput } from 'src/apis/productsSaleslocations/dto/product-saleslocation.input';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Min(0)
  @Field(() => Int)
  price: number;

  // createProduct에서 productSaleslocation관련 데이터를 한번에 같이 받아오기 위한 코드
  @Field(() => ProductSaleslocationInput)
  productSaleslocation: ProductSaleslocationInput;

  // ** 카테고리 테이블은 카데고리 데이터 전체를 백엔드에 보내주는게 아니라 상품테이블에 id만 조인해서 보낼거니까 productCategoryId만 연결한다
  @Field(() => String)
  productCategoryId: string;
}
