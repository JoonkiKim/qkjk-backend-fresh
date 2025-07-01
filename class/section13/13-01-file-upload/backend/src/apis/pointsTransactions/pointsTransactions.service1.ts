// 더 쉽게 Serializable을 적용해보자
// 조회 & 업데이트 를 합쳐버릴 수 있다

// pointTransactions.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import {
  PointTransaction,
  POINT_TRANSACTION_STATUS_ENUM,
} from './entities/pointTransaction.entity';
import { IPointsTransactionsServiceCreate } from './interfaces/points-transactions-service.interface';

@Injectable()
export class PointsTransactionsService {
  constructor(
    @InjectRepository(PointTransaction)
    private readonly pointsTransactionsRepository: Repository<PointTransaction>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly dataSource: DataSource, //
  ) {}

  async create({
    impUid,
    amount,
    user: _user,
  }: IPointsTransactionsServiceCreate): Promise<PointTransaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE'); // 레벨4로 설정

    try {
      // 1. PointTransaction 테이블에 거래기록 1줄 생성
      const pointTransaction = this.pointsTransactionsRepository.create({
        impUid,
        amount,
        user: _user,
        status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
      });
      await queryRunner.manager.save(pointTransaction);

      // 2. 유저의 돈 정보를 조회해서 바로 업데이트하기
      const id = _user.id;
      await queryRunner.manager.increment(
        User,
        { id }, // 이 유저 아이디를 가진 행의
        'point', // 포인트라는 컬럼을
        amount, // amount만큼 '증가시켜줘'
      );
      // 근데! 숫자가 아닌 경우에는 이 increment방식이 불가능함
      // 숫자가 아니라면 service2방식을 써서 직접 락을 걸어줘야된다

      await queryRunner.commitTransaction();

      // 3. 최종결과 브라우저에 돌려주기
      return pointTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
