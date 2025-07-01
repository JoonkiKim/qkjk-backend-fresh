import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Allergy } from 'src/apis/allergies/entities/allergy.entity';
import { ProductCategory } from 'src/apis/productsCategories/entities/productCategory.entity';
import { ProductDetail } from 'src/apis/productsDetails/entities/productDetail.entity';

import { Store } from 'src/apis/stores/entities/store.entity';

import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  // 요건 null 허용이라고 하면, 엔티티(Entity), DTO, TypeScript 모두에서 설정해야 한다
  @Column({ nullable: true }) //
  @Field(() => String, { nullable: true }) //
  description?: string;

  @Column()
  @Field(() => Int)
  price: number;

  @Column({ default: false })
  @Field(() => Boolean)
  isSoldout: boolean;

  @ManyToOne(() => ProductCategory)
  @Field(() => ProductCategory)
  productCategory: ProductCategory;

  @ManyToOne(() => Store)
  @Field(() => Store)
  store: Store;

  @JoinColumn() // ✅ FK를 설정하는 곳
  @OneToOne(() => ProductDetail) // ✅ 상품과 1:1 관계 설정
  @Field(() => ProductDetail)
  productDetail: ProductDetail;

  @JoinTable()
  @ManyToMany(() => Allergy, (allergies) => allergies.products)
  @Field(() => [Allergy])
  allergies: Allergy[];

  @DeleteDateColumn()
  deletedAt: Date;
}
