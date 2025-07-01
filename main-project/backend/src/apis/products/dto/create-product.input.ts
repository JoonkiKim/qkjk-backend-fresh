import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { AllergyInput } from 'src/apis/allergies/dto/allergy-input';
// import { Allergy } from 'src/apis/allergies/entities/allergy.entity';

import { ProductDetailInput } from 'src/apis/productsDetails/dto/product-detail.input';
import { ProductImageInput } from 'src/apis/productsImages/dto/create-productImage.input';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true }) // ✅ GraphQL에서 NULL 허용
  description?: string;

  @Min(0) // 0 아래로는 못들어온다, 가격이니까 0 아래로 못들어오게 한다(원래 int는 음수도 들어온다)
  @Field(() => Int)
  price: number;

  @Field(() => ProductDetailInput)
  productDetail: ProductDetailInput;

  // ** 카테고리 테이블은 카데고리 데이터 전체를 백엔드에 보내주는게 아니라 상품테이블에 id만 조인해서 보낼거니까 productCategoryId만 연결한다
  @Field(() => String)
  productCategoryId: string;

  @Field(() => String)
  storeId: string;

  @Field(() => [AllergyInput], { nullable: true })
  allergies?: AllergyInput[];
  // N:M은 dto를 양쪽 다 만들어줘야된다!

  /** 이미지 배열 (url·isMain 포함) */
  @Field(() => [ProductImageInput])
  productImageUrls: ProductImageInput[];
}
