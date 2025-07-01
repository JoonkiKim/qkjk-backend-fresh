import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ProductDetail {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  desc: string; // 상세설명

  @Column()
  @Field(() => String)
  origin: string; // 원산지지

  @Column()
  @Field(() => Int)
  stock: number; // 재고수량

  @Column()
  @Field(() => Date)
  expiration: Date; // 유통기한
}
