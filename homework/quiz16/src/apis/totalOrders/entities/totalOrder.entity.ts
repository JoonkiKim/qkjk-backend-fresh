import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class TotalOrder {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => Int)
  price: number;

  @Column({ type: 'timestamp', precision: 3 })
  @Field(() => Date)
  rdate: Date;
  // 시분초 까지 만드는 법

  @Column()
  @Field(() => String)
  payment_method: string;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
