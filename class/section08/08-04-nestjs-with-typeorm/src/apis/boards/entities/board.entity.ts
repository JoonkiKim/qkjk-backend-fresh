import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// @로 앞에 써있는걸 데코레이터라고 했는데, 지금 선언해준 클래스가 Entity로 생성될거라고  typeorm한테 알려주는 코드, "이 클래스는 엔티티로 사용할거란다~"

@Entity()
export class Board {
  @PrimaryGeneratedColumn('increment')
  number: number;
   // 각 행을 구분하기 위해 PK를 지정해줘야되는데, 그걸 해주는 코드가 이거임
  // increment는 숫자 하나씩 증가, uuid는 id할당, rowid&identity는 mysql말고 다른 디비에서 사용하는 것
  @Column() // 이건 아래의 내용을 column으로 지정해달라는 뜻이다
  writer: string;
  @Column()
  title: string;
  @Column()
  contents: string;
}
