// pointTransactions.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}

  async create({
    impUid,
    amount,
    user: _user,
  }: // 아래쪽에서 user라는 변수를 또 사용해야되기 때문에 여기서 _user로 바꿔서 써준다! -> 이 안에서는 _user라는 이름으로 사용해야되는거임!(user라는 이름을 삭제하고 _user라는 이름으로 받아오는거임) <> 아래의 create함수랑 완전히 반대인 개념이니까 구분하기
  IPointsTransactionsServiceCreate): Promise<PointTransaction> {
    console.log(_user);
    // IPointsTransactionsServiceCreate에서 어떤 값을 받아올 것인지 선언해준다
    // pointTransaction을 리턴해주니까 리턴값은 Promise<PointTransaction>을 해준다

    // this.pointsTransactionsRepository.create(); // 등록을 위한 빈 객체 만들기
    // this.pointsTransactionsRepository.save(); // 결과를 받을 수 있는 "등록" 방법 - 디비 접속함
    // this.pointsTransactionsRepository.insert(); // 결과는 못 받는 "등록" 방법 - 디비 접속함
    // this.pointsTransactionsRepository.update(); // 결과는 못 받는 "수정" 방법 - 디비 접속함

    // 1. PointTransaction 테이블에 거래기록 1줄 생성 -> save함수 사용
    // create로 빈객체를 만든다음에 그걸 변수에 저장하고 그 변수를 save로 디비에 저장한다
    const pointTransaction = this.pointsTransactionsRepository.create({
      impUid,
      amount,
      user: _user, // 위에서 받아오는것과 반대로 여기서는 _user라는 값을 user라는 키에 넣어주는거임
      status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
    });
    await this.pointsTransactionsRepository.save(pointTransaction);
    // **Promise를 써야되는지 안써야되는지 확인하는법
    // 해당 함수에 마우스를 갖다댔을때 Promise라고 뜨면 await async에 Promise를 써줘야하고, 아니면 안써주면 된다

    // 2. 유저의 돈 정보 조회해오기
    // 유저가 지금 포인트(돈)를 얼마 가지고 있는지 먼저 조회해오는거임
    // 유저테이블에 서비스만들어서 조회해오면 더 좋음
    // 여기 user에는 해당 유저와 관련된 모든 데이터가 들어있음
    const user = await this.usersRepository.findOne({
      where: { id: _user.id }, // _user는 context에서 받아온 유저정보이니까 여기서 조회할떄는  _user.id를 써준다
    });

    // 3. 유저의 돈 업데이트
    // 위에서 조회해온 포인트 정보에 추가한 amount를 더해서 업데이트
    // 리턴값에 PointTransaction 테이블에 거래기록 1줄 생성한 결과를 보내줄거기때문에 응답결과를 못받는 update함수를 써도 된다
    await this.usersRepository.update(
      { id: _user.id },
      { point: user.point + amount },
    );

    // 4. 최종결과 브라우저에 돌려주기
    return pointTransaction;
  }
}
