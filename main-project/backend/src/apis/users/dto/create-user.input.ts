// users/dto/create-user.input.ts
import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsEmail, MinLength, IsInt } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @Field(() => Int)
  @IsInt()
  age: number;

  @Field(() => String)
  phone: string;
}
