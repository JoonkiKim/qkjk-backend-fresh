import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  @Field(() => String)
  userpwd: string;

  @Column()
  @Field(() => String)
  phone: string;

  @Column()
  @Field(() => Int)
  gender: number;

  @Column()
  @Field(() => Boolean)
  signOut: boolean;
}
