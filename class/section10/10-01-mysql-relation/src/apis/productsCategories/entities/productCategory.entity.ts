import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true }) // 카테고리 이름은 똑같을 수가 없으니까 unique로 중복된 이름의 카테고리를 못넣게 방지해준다
  name: string;
}
