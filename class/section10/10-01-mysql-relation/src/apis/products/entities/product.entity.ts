// product테이블을 만들어보자
// graphql은 일단 넣지 말고 타입스크립트로만 작성해보자

// 이걸 만들어서 DB에 연결하면 ERD에서 만든것처럼 DB에 테이블이 생긴다

import { ProductCategory } from 'src/apis/productsCategories/entities/productCategory.entity';
import { ProductSaleslocation } from 'src/apis/productsSaleslocations/entities/productSaleslocation.entity';
import { ProductTag } from 'src/apis/productsTags/entities/productTag.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column({ default: false }) // 만들때부터 팔리는 상품은 없으니까 기본값을 안팔린거로 해준다
  isSoldout: boolean;

  // [1:1 연결 방법]
  @JoinColumn() // 일대일연결할떄는 중심이 되는 테이블쪽에 JoinColumn을 넣어준다
  @OneToOne(() => ProductSaleslocation)
  // productSaleslocation:ProductSaleslocation; 이 부분은 단순히 컬럼이기 때문에 어떤 테이블이랑 연결할지를 선언해줘야되는데 그게 () => ProductSaleslocation 부분이다

  // 일대일관계로 연결해줄땐 이렇게 해준다,
  // 이건 product테이블과 ProductSaleslocation테이블을 일대일로 연결해준다는 뜻
  // 이때 타입은 따로 인터페이스 안 만들고 ProductSaleslocation엔티티 만들어놓은거 있으니까 그거 그대로 사용한다(클래스는 타입으로 사용할 수 있으니까)
  productSaleslocation: ProductSaleslocation;
  // 컬럼을 이렇게 반대쪽 테이블 이름으로 선언해주면 알아서 반대쪽 테이블의 PK컬럼이랑(이경우는 id컬럼) 연결이 되는것같다

  // 정리하면 "ProductSaleslocation테이블과 일대일 연결(OneToOne)을 할거고 JoinColumn을 여기서 선언해줬으니 여기가 중심이 되는 테이블이야. 이때 FK이름은 productSaleslocation 이고 타입은 ProductSaleslocation이야
  // 1:1관계에서 반대쪽 테이블은 아무것도 안해줘도 된다

  // [N:1 연결방법]
  // 상품이 N, 카테고리가 1이다
  // ManyToOne에서는 JoinColumn할 필요가 없다
  // ManyToOne에서도 반대쪽은 아무것도 안해도 된다
  @ManyToOne(() => ProductCategory) // 어떤 테이블에 연결할지 선언
  productCategory: ProductCategory;

  @ManyToOne(() => User)
  user: User;

  // [N:N 연결방법]
  // 다대다 관계에서는 연결용 테이블이 하나 생성되었었는데, 기본적으로 따로 상품_상품태그 테이블을 만들어줄 필요는 없음
  // cf) 하지만 반드시 만들어줘야하는 경우도 있음. 그건 뒤에서 배우자
  // ERD상에서는 상품과 상품태그 각각의 테이블에 FK가 없음 -> ORM에서는 각 테이블 둘다에 ManyToMany를 선언해줘야된다. 그러면 자동으로 연결용테이블이 생성된다
  // 그리고 둘중에 한군데에 JoinTable을 써줘야된다 -> 이걸 써줘야 중간테이블이 만들어진다

  @JoinTable() // 중간 '테이블'을 만들어주는 부분
  @ManyToMany(() => ProductTag, (productsTags) => productsTags.products)
  // 다대다 에서는 서로가 서로를 어떤 컬럼명으로 부르고 있는지 써줘야됨. 여기서는 productTags로 반대편테이블을 선언해줬고 저쪽에서는 products로 선언했기 문에 (productsTags)=> productsTags.products 이렇게 써준다. 반대편 테이블은 반대로 쓰면된다
  productTags: ProductTag[]; // 태그는 여러개이니까 객체를 여러개 담을 수 있는 배열로 타입을 선언해준다
}
