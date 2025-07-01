import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AllergyInput {
  @Field()
  name: string;
}
