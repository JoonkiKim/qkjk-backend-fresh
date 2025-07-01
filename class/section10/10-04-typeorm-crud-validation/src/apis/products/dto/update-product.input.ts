import { InputType, PartialType } from '@nestjs/graphql';
import { CreateProductInput } from './create-product.input';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
  // 업데이트는 등록이랑 구조는 똑같은데 필수입력이 아니라는 점만 다름 -> 유틸리티 타입을 사용해주면됨 -> 그래프큐엘에도 유틸리티 타입처럼 사용할 수 있는게 있음! 기존 유틸리티 타입에 Type이라는 이름을 달아주면 됨
  // PartialType으로 CreateProductInput을 감싸주고 상속을 받아주면 모든 요소가 필수아님으로 수정되어서 상속된다
  //
  // @Field(() => String, { nullable: true })
  // name?: string;
  // @Field(() => String, { nullable: true })
  // description?: string;
  // @Min(0)
  // @Field(() => Int, { nullable: true })
  // price?: number;
}
