import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ProductCategory {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ unique: true }) // 카테고리 이름은 똑같을 수가 없으니까 unique로 중복된 이름의 카테고리를 못넣게 방지해준다
  @Field(() => String)
  name: string;
}
