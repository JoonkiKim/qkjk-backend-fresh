import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/apis/products/entities/product.entity';
import { TotalOrder } from 'src/apis/totalOrders/entities/totalOrder.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => Int)
  price: number;

  @Column()
  @Field(() => Int)
  count: number;

  @ManyToOne(() => Product)
  @Field(() => Product)
  productCategory: Product;

  @ManyToOne(() => TotalOrder)
  @Field(() => TotalOrder)
  totalOrder: TotalOrder;
}
