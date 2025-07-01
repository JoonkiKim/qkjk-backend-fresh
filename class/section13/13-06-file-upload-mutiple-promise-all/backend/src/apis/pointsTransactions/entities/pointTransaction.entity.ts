// pointTransaction.entity.ts

// 이런 테이블은 insert only테이블이라고 해서 수정이 안들어간다
// 그럼 업데이트는 어떻게 하냐 -> 예를 들어 환불을 한 경우, 동일한 imp에 대해서 취소완료라는 데이터를 다시 만듦 -> 그럼 결제와 취소의 createdAt이 다를테니까 히스토리 추적이 가능해진다
// 그래서 업데이트는 안 만든다

import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum POINT_TRANSACTION_STATUS_ENUM {
  PAYMENT = 'PAYMENT',
  CANCEL = 'CANCEL',
}

// 이 부분이 enum타입을 graphql에 등록해주기 위한 처리
registerEnumType(POINT_TRANSACTION_STATUS_ENUM, {
  name: 'POINT_TRANSACTION_STATUS_ENUM',
});

@Entity()
@ObjectType()
export class PointTransaction {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  impUid: string;

  @Column()
  @Field(() => Int)
  amount: number;

  // 결제 상태 컬럼에는 정해진 문자열만 들어갈 수 있도록 enum으로 지정해준다
  @Column(
    { type: 'enum', enum: POINT_TRANSACTION_STATUS_ENUM },
    // 이 안쪽부분은 Mysql에 알려주는 부분
  )
  @Field(() => POINT_TRANSACTION_STATUS_ENUM) // 여기는 graphql타입
  status: string; // 결제 상태를 나타내는 항목

  @ManyToOne(() => User) // 다대일 테이블 연결하는 컬럼이고, 여기서는 유저가 1, 여기 이 테이블이 N이다
  @Field(() => User)
  user: User;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;
}
