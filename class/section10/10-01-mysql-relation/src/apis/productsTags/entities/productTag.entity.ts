import { Product } from 'src/apis/products/entities/product.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  // 이쪽 테이블이랑 반대쪽 테이블 모두에 ManyToMany를 선언해줘야 중간테이블이 생긴다
  @ManyToMany(() => Product, (products) => products.productTags)
  products: Product[];
  // 다대다 관계이니까 product에 s가 붙는거임
}
