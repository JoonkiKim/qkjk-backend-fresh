import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ProductCategory } from 'src/apis/productsCategories/entities/productCategory.entity';
import { ProductSaleslocation } from 'src/apis/productsSaleslocations/entities/productSaleslocation.entity';
import { ProductTag } from 'src/apis/productsTags/entities/productTag.entity';
import { User } from 'src/apis/users/entities/user.entity';
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

  @Column()
  @Field(() => String)
  description: string;

  @Column()
  @Field(() => Int)
  price: number;

  @Column({ default: false })
  @Field(() => Boolean)
  isSoldout: boolean;

  @JoinColumn()
  @OneToOne(() => ProductSaleslocation)
  @Field(() => ProductSaleslocation)
  productSaleslocation: ProductSaleslocation;

  @ManyToOne(() => ProductCategory)
  @Field(() => ProductCategory)
  productCategory: ProductCategory;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinTable()
  @ManyToMany(() => ProductTag, (productsTags) => productsTags.products)
  @Field(() => [ProductTag])
  productTags: ProductTag[];

  @DeleteDateColumn() // 이걸써줘야 softDelete함수가 얘를 삭제여부용컬럼으로 인식하고 여기에 삭제 로그를 쌓는다!
  deletedAt: Date;

  // 이렇게 자동으로 시간을 찍어주는 컬럼을 만드는 데코레이터가 또 있음

  // @CreateDateColumn
  // createdAt: Date;
  //  -> 등록할때 date를 찍어줌

  // @UpdateDateColumn
  // updatedAt: Date;
  // 업데이트 날짜를 찍어줌
}
