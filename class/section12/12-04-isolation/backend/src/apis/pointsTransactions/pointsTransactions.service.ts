// 하나라도 에러가 나면 모두 롤백해버리는 '트랜잭션'을 적용해보자

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
    // 1번 2번 3번 함수를 하나의 트랜잭션으로 묶어줄거임
    // 아래 세줄이 기본 세팅!
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // 싹다 try안에 넣어주고 에러발생시 catch로 잡아준다

    try {
      // 1. PointTransaction 테이블에 거래기록 1줄 생성
      const pointTransaction = this.pointsTransactionsRepository.create({
        impUid,
        amount,
        user: _user,
        status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
      });
      // 이렇게 바로 save하게 되면 그 안에서 트랜잭션이 발생해서 commit이 일어난다 -> queryRunner를 통해 저장하면 commit이 안되고 임시저장이 되어서 우리가 의도한 트랜잭션을 수행할 수 있다
      // await this.pointsTransactionsRepository.save(pointTransaction);
      await queryRunner.manager.save(pointTransaction);

      // // 테스트용 에러 던지기
      // throw new Error('예기치못한 실패');

      // 2. 유저의 돈 정보 조회해오기
      // const user = await this.usersRepository.findOne({
      //   where: { id: _user.id },
      // });
      const user = await queryRunner.manager.findOne(User, {
        where: { id: _user.id },
      });
      // queryRunner.manager.findOne은 테이블을 명시 안해줬기 때문에 User테이블을 지정해주는거고, queryRunner.manager.save(pointTransaction)는 위에서 this.pointsTransactionsRepository.create를 통해 pointsTransactions를 쓴다는걸 써줬기 때문에 테이블 이름을 생략한거다

      // 3. 유저의 돈 업데이트
      // update는 save와 같으니까 , create로 빈객체를 만들고 save함수로 업데이트를 해준다
      // await this.usersRepository.update(
      //   { id: _user.id },
      //   { point: user.point + amount },
      // );
      // save를 할때 유저 아이디가 있으면 수정, 없으면 등록으로 작동하는데, 이 경우 특정 유저의 값을 수정해야되니까 유저 아이디를 넣어준다. 근데 위에서 만든 user변수에 id가 있으니까 그걸 스프레드 시켜서 아래에 넣어준다
      const updatedUser = await this.usersRepository.create({
        ...user,
        point: user.point + amount,
      });
      await queryRunner.manager.save(updatedUser);

      // 위의 과정까지는 commit이 되지 않다가 아래의 코드를 실행하면 딱 커밋이 되는거임!
      await queryRunner.commitTransaction();
      // 디비와의 연결도 끊어놓기
      // await queryRunner.release();

      // 4. 최종결과 브라우저에 돌려주기
      return pointTransaction;
    } catch (error) {
      // 성공을 하다가 중간에 실패하면 기존에 성공한 애들까지 싹다 롤백해준다
      await queryRunner.rollbackTransaction();
      // 실패했을때도 연결을 끊어준다
      // await queryRunner.release();
      // 근데 이렇게 되면 await queryRunner.release();를 두번쓰는거니까 반복되어서 보기 안 좋음 -> finally로 처리해준다
    } finally {
      await queryRunner.release();
      // 이걸 안해주면 commit이 끝나도 커넥션이 안 끊기고 sleep상태인채로 계속 디비 연결이 늘어난다. 꼭 써줘야된다 (하지만 에러가 발생하면 자동으로 연결이 끊긴다)
    }
  }
}
