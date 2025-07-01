import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType() // 이걸 통해서 그래프큐엘 타입을 선언해준다
export class Starbucks {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int) // 그래프큐엘에서 숫자는 int니까 이렇게 해주고
  number: number;

  @Column()
  @Field(() => String) // 엔티티에서처럼 이렇게 묶어서 보낼때도 그래프큐엘 용 타입을 선언해줘야된다
  menu: string; // 이건 타입스크립트용 타입

  @Column()
  @Field(() => Int)
  price: number;

  @Column()
  @Field(() => Int)
  kcal: number;

  @Column()
  @Field(() => Int)
  saturated_fat: number;

  @Column()
  @Field(() => Int)
  protein: number;

  @Column()
  @Field(() => Int)
  salt: number;

  @Column()
  @Field(() => Int)
  sugar: number;

  @Column()
  @Field(() => Int)
  caffeine: number;
}
