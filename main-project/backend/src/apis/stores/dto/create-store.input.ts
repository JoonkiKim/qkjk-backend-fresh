import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
// import { Min } from 'class-validator';

@InputType()
export class CreateStoreInput {
  @Field(() => String)
  @IsString() // validator를 필수로 넣어줘야 되는듯!
  name: string;

  @Field(() => String)
  @IsString()
  address: string;

  @Field(() => String)
  @IsString()
  description: string;
}
