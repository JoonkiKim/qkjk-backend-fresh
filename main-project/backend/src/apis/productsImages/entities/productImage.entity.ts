import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/apis/products/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  url: string;

  @Column({ default: false })
  @Field(() => Boolean)
  isMain: boolean;

  // 여러 이미지에 하나의 상품
  @ManyToOne(() => Product)
  @Field(() => Product)
  product: Product;
}
