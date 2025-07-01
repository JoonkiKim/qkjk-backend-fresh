import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
@ObjectType() // 이걸 통해서 그래프큐엘 타입을 선언해준다
export class Board {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int) // 그래프큐엘에서 숫자는 int니까 이렇게 해주고
  number: number;

  @Column()
  @Field(() => String)
  // 그래프큐엘에서 스트링은 대문자니까 이렇게 String 으로 해준다
  writer: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  contents: string;
}
