import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class DeleteUserOutput {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  message: string;
}
