import { Field, InputType } from '@nestjs/graphql';

@InputType() // 조회용도로 만들었던 엔티티와 다르게 dto는 input을 위해 만들었으므로 input타입으로 만들어줘야된다
export class CreateBoardInput {
  @Field(() => String) // 엔티티에서처럼 이렇게 묶어서 보낼때도 그래프큐엘 용 타입을 선언해줘야된다
  writer: string; // 이건 타입스크립트용 타입

  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;
}
