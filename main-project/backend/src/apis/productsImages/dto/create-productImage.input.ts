import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ProductImageInput {
  @Field(() => String)
  url: string;

  @Field(() => Boolean, { defaultValue: false, nullable: true })
  isMain?: boolean; // 대표 이미지 여부
}
