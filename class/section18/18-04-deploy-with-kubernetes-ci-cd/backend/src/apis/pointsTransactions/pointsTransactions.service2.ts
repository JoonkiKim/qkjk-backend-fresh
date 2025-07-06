// Serializable을 적용해보자

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

      // 2. 유저의 돈 정보 조회해오기
      const user = await queryRunner.manager.findOne(User, {
        where: { id: _user.id }, // 특정 id에만 조회하도록 조건을 걸었으니까 테이블 전체가 아닌 row-lock설정을 한거임
        lock: { mode: 'pessimistic_write' },
      });
      // ** 만약 이 부분에서 다른 유저가 조회해서 업데이트를 또 실행시킨다면 데이터가 꼬일 수 있음 -> 여기서 락을 걸어줘서 현재 유저가 조회를 하는 경우에는 다른 유저가 접근하지 못하도록 해줘야된다 -> 위쪽에 startTransaction에 설정해주자

      // 3. 유저의 돈 업데이트
      const updatedUser = await this.usersRepository.create({
        ...user,
        point: user.point + amount,
      });
      await queryRunner.manager.save(updatedUser);

      await queryRunner.commitTransaction();

      // 4. 최종결과 브라우저에 돌려주기
      return pointTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
