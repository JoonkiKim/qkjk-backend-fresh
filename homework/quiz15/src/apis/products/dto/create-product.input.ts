import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true }) // ✅ GraphQL에서 NULL 허용
  description?: string;

  @Min(0) // 0 아래로는 못들어온다, 가격이니까 0 아래로 못들어오게 한다(원래 int는 음수도 들어온다)
  @Field(() => Int)
  price: number;
}
