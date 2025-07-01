// pointTransactions.service.ts

import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import {
  IPaymentsServiceCancel,
  IPaymentsServiceCheckAlreadyCanceled,
  IPaymentsServiceCheckDuplication,
  IPaymentsServiceCheckHasCancelablePoint,
  IPaymentsServiceCreate,
  IPaymentsServiceCreateForPayment,
  IPaymentsServiceFindByImpUidAndUser,
  IPaymentsServiceFindOneByImpUid,
} from './interfaces/payment-service.interface';
import { Payment, PAYMENT_STATUS_ENUM } from './entities/payment.entity';
import { IamportService } from '../iamport/iamport.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly iamportService: IamportService,
    private readonly dataSource: DataSource, //
  ) {}

  // 트랜잭션 적용 전
  // findOneByImpUid({
  //   impUid,
  // }: IPaymentsServiceFindOneByImpUid): Promise<Payment> {
  //   return this.paymentsRepository.findOne({ where: { impUid } });
  // }
  // async checkDuplication(
  //   { impUid }: IPaymentsServiceCheckDuplication,
  //   manager?: EntityManager,
  // ): Promise<void> {
  //   const result = await this.findOneByImpUid({ impUid });
  //   if (result) throw new ConflictException('이미 등록된 결제 아이디입니다');
  // }

  // ① impUid 단건 조회도 manager를 받도록 확장
  findOneByImpUid(
    { impUid }: IPaymentsServiceFindOneByImpUid,
    manager?: EntityManager,
  ): Promise<Payment | null> {
    const repo = manager?.getRepository(Payment) ?? this.paymentsRepository;
    return repo.findOne({ where: { impUid } });
  }

  // ② 중복 검사: 같은 로직, but manager 전달
  async checkDuplication(
    { impUid }: IPaymentsServiceCheckDuplication,
    manager?: EntityManager,
  ): Promise<void> {
    const result = await this.findOneByImpUid({ impUid }, manager); // ← 같은 트랜잭션
    if (result) throw new ConflictException('이미 등록된 결제 아이디입니다');
  }

  // [트랜잭션 적용 전]
  // async createValue(
  //   {
  //     impUid,
  //     amount,
  //     user: _user,
  //     status = PAYMENT_STATUS_ENUM.PAYMENT, // 이렇게 해주면 기본값은 PAYMENT_STATUS_ENUM.PAYMENT로 해주고 다른 값을 넣을때 덮어쓰기 하면 된다
  //     pay_method,
  //   }: IPaymentsServiceCreate,
  //   manager?: EntityManager,
  // ): Promise<Payment> {
  //   // 1. 거래기록 1줄 생성
  //   const pointTransaction = this.paymentsRepository.create({
  //     impUid,
  //     amount,
  //     user: _user, // 위에서 받아오는것과 반대로 여기서는 _user라는 값을 user라는 키에 넣어주는거임
  //     status,
  //     pay_method,
  //   });
  //   await this.paymentsRepository.save(pointTransaction);

  //   // 2. 유저의 돈 정보 조회해오기
  //   const user = await this.usersRepository.findOne({
  //     where: { id: _user.id }, // _user는 context에서 받아온 유저정보이니까 여기서 조회할떄는  _user.id를 써준다
  //   });

  //   // 3. 유저의 돈 업데이트
  //   // 위에서 조회해온 포인트 정보에 추가한 amount를 더해서 업데이트
  //   // 리턴값에 PointTransaction 테이블에 거래기록 1줄 생성한 결과를 보내줄거기때문에 응답결과를 못받는 update함수를 써도 된다
  //   await this.usersRepository.update(
  //     { id: _user.id },
  //     { point: user.point + amount },
  //   );

  //   // 4. 최종결과 브라우저에 돌려주기
  //   return pointTransaction;
  // }
  async createValue(
    {
      impUid,
      amount,
      user: _user,
      status = PAYMENT_STATUS_ENUM.PAYMENT,
      pay_method,
    }: IPaymentsServiceCreate,
    manager: EntityManager,
  ): Promise<Payment> {
    // (1) 거래 기록 생성
    const paymentRepo = manager.getRepository(Payment);
    const pointTransaction = paymentRepo.create({
      impUid,
      amount,
      user: _user,
      status,
      pay_method,
    });
    await paymentRepo.save(pointTransaction);

    // (2) 유저 포인트 증액
    await manager.increment(User, { id: _user.id }, 'point', amount);

    // (3) 결과 반환
    return pointTransaction;
  }

  async createForPayment({
    impUid,
    amount,
    user,
    pay_method,
  }: IPaymentsServiceCreateForPayment): Promise<Payment> {
    console.log(user);

    // 여기서 SERIALIZABLE 선언
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE'); // 레벨4로 설정
    try {
      // 거래기록 생성하기 전에 거래내용을 '검증'해보자

      // 우선 프런트에서 받아온 거래기록이 실제로 아임포트에 있는지 검증해보자
      // 아임포트에서 고객사 식별코드와 RESTAPI키 이렇게 두개가 있는데, 전자는 브라우저에서 결제요청할때 사용하는거고, 후자는 백엔드에서 사용하는거다 -> 여기서는 RESTAPI키를 사용한다

      // 검증1: 결제 완료 상태인지 검증하기 (아임포트를 통해서 검증)
      // 진짜 결제 한거 맞나? 를 확인하는거임
      // 실제로 그 impUid로 결제되었는지 & amount가 정확한지 둘다 체크해야됨
      // 아임포트와 관련된 코드들은 아임포트 서비스에 다 모아두고 거기서 함수를 꺼내와서 사용하자
      await this.iamportService.checkPaid({ impUid, amount });

      // 검증2: 이미 결제되었던 id인지 검증하기 (우리 디비에서 검증)
      // 이미 결제되었던 id라면 우리 디비에 그 impUid가 있을거임. 따라서 impUid를 조회했을때 그 아이디가 "있으면" 에러를 던지면 되는거임
      // 근데 이건 다른데서도 많이 쓸테니까 위에 하나 따로 함수를 만들어주자
      // this.paymentsRepository.findOne({where: {impUid}})
      // 더 나아가서 이런 중복을 검증하는 함수자체를 따로 빼서 함수 이름만 봐도 어떤 역할을 하는지 알 수 있게 만들어보자
      // const result = await this.findOneByImpUid({ impUid });
      // if (result) throw new ConflictException('이미 등록된 결제 아이디입니다');
      await this.checkDuplication({ impUid }, queryRunner.manager);
      // [검증로직 테스트 방법]
      // 1. 이상한 impUid로 요청
      // 2. 정상 결제 기록 하나 만들기
      // 3. 동일한 impUid & amount 로 결제 요청하기

      // 아래 내용은 재사용을 위해 따로 뺴준다
      // // 1. 거래기록 1줄 생성
      // const pointTransaction = this.paymentsRepository.create({
      //   impUid,
      //   amount,
      //   user: _user, // 위에서 받아오는것과 반대로 여기서는 _user라는 값을 user라는 키에 넣어주는거임
      //   status: PAYMENT_STATUS_ENUM.PAYMENT,
      //   pay_method,
      // });
      // await this.paymentsRepository.save(pointTransaction);

      // // 2. 유저의 돈 정보 조회해오기
      // const user = await this.usersRepository.findOne({
      //   where: { id: _user.id }, // _user는 context에서 받아온 유저정보이니까 여기서 조회할떄는  _user.id를 써준다
      // });

      // // 3. 유저의 돈 업데이트
      // // 위에서 조회해온 포인트 정보에 추가한 amount를 더해서 업데이트
      // // 리턴값에 PointTransaction 테이블에 거래기록 1줄 생성한 결과를 보내줄거기때문에 응답결과를 못받는 update함수를 써도 된다
      // await this.usersRepository.update(
      //   { id: _user.id },
      //   { point: user.point + amount },
      // );

      // // 4. 최종결과 브라우저에 돌려주기
      // return pointTransaction;

      const result = await this.createValue(
        { impUid, amount, user, pay_method },
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // [결제취소 서비스]
  // 트랜잭션에서의 사용을 위해 아래의 코드로 바꿔준다
  // impUid, user정보를 통해 해당 유저의 결제 정보 및 포인트 정보를 가져온다

  // findByImpUidAndUser({
  //   impUid,
  //   user,
  // }: IPaymentsServiceFindByImpUidAndUser): Promise<Payment[]> {
  //   // find함수는 여러개를 가져오는거니까 배열타입으로 리턴타입을 지정해준다
  //   return this.paymentsRepository.find({
  //     where: { impUid, user: { id: user.id } },

  //     relations: ['user'], // 우리 디비에 들어있는 해당 유저의 포인트 정보를 가져오기 위해 relations: ['user']를 통해 user테이블 정보를 가져온다
  //   });
  // }
  findByImpUidAndUser(
    { impUid, user }: IPaymentsServiceFindByImpUidAndUser,
    manager?: EntityManager, // ★ 추가
  ): Promise<Payment[]> {
    const repo =
      manager?.getRepository(Payment) ?? // 트랜잭션 안이면 queryRunner.manager
      this.paymentsRepository; // 기본 커넥션(전역)

    return repo.find({
      where: { impUid, user: { id: user.id } },
      relations: ['user'],
    });
  }

  // 이미 취소된 id인지 검증
  checkAlreadyCanceled({
    payments,
  }: IPaymentsServiceCheckAlreadyCanceled): void {
    const canceledPayments = payments.filter(
      (el) => el.status === PAYMENT_STATUS_ENUM.CANCEL,
    );

    if (canceledPayments.length) {
      throw new ConflictException('이미 취소된 결제 아이디입니다');
    }
  }

  // 충분한 포인트가 있는지 검증
  checkHasCancelablePoint({
    payments,
  }: IPaymentsServiceCheckHasCancelablePoint): void {
    const paidPayments = payments.filter(
      (el) => el.status === PAYMENT_STATUS_ENUM.PAYMENT,
    );
    if (!paidPayments.length) {
      throw new UnprocessableEntityException('결제 기록이 존재하지 않습니다.');
    }
    if (paidPayments[0].user.point < paidPayments[0].amount) {
      throw new UnprocessableEntityException('포인트가 부족합니다.');
    }
  }

  async cancel({ impUid, user }: IPaymentsServiceCancel): Promise<Payment> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE'); // 레벨4로 설정
    try {
      // 우선 결제 내역을 조회하기
      const payments = await this.findByImpUidAndUser(
        { impUid, user },
        queryRunner.manager,
      );

      // 1. 이미 취소되었던 id인지 검증하기
      // impUid 중에 status가 CANCEL인게 있는지 조회하기 <> 반대는 PAYMENT
      // 부분취소는 불가능하도록 해놨으니까 status가 CANCEL인게 있으면 무조건 전체 취소인거고 , 만약 그게 취소가 되었던 적이 있다면 또 되게 하면 안되는거임
      // 결제상태가 cancel인 값이 impUid가 있는지 확인해서 canceledPayments에 담아주고 -> 값이 나오면! 에러를 던져야됨
      // 이것도 따로 함수로 빼준다
      // const canceledPayments = payments.filter(
      //   (el) => el.status === PAYMENT_STATUS_ENUM.CANCEL,
      // );

      // if (canceledPayments.length) {
      //   throw new ConflictException('이미 취소된 결제 아이디입니다');
      // }
      this.checkAlreadyCanceled({ payments });

      // 2. 결제를 취소할만큼 포인트가 충분히 있는지
      // //(포인트를 환불한다는건 포인트에서 계좌로 돈이 빠져나가는거니까!)
      // 우선 결제상태가 payment인 기록들만 필터를 하고 (있는지 확인하고) -> 거기에 충분한 포인트가 있는지 확인한다
      // const paidPayments = payments.filter(
      //   (el) => el.status === PAYMENT_STATUS_ENUM.PAYMENT,
      // );
      // if (!paidPayments.length) {
      //   throw new UnprocessableEntityException('결제 기록이 존재하지 않습니다.');
      // }

      // ** 조인 로직 잘 확인하기기
      // 위의 필터를 통과한 통과한 impUid가 하나밖에 없으니까 paidPayments[0]를 호출하면 impUid가 나온다 -> 아까 user테이블을 조인했기 때문에 그 안에 있는 point정보도 가져올 수 있다
      // user테이블에 있는 포인트가 취소하려는 포인트보다 적으면 취소해주면 안되니까 그걸 필터링해준다다
      // 아래 내용도 checkHasCancelablePoint에 포함해주기
      // if (paidPayments[0].user.point < paidPayments[0].amount) {
      //   throw new UnprocessableEntityException('포인트가 부족합니다.');
      // }
      this.checkHasCancelablePoint({ payments });

      // 3. 결제 취소하기 -> 아임포트 측에서 취소한다
      // 근데! 결제취소 로직은 사실상 결제 등록 로직과 비슷함 -> 위의 결제 등록 로직을 분리해서 함수로 만든다음에 여기로 가져와서 쓴다
      const canceledAmount = await this.iamportService.cancel({ impUid });

      // 4. 취소된 결과 확인하기
      // amount에 canceledAmount를 넣어줄때 마이너스를 붙여줘야 된다 -> 취소하는거니까!

      // ** result에 값을 담을때까지 기다리고 ->  queryRunner.commitTransaction();을 하고 그다음에 return을 해줘야하는거였음
      const result = await this.createValue(
        {
          impUid,
          amount: -canceledAmount,
          user,
          status: PAYMENT_STATUS_ENUM.CANCEL,
        },
        queryRunner.manager,
      );
      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // 이렇게 해줘야 CustomExceptionFilter에서 에러를 받아줄 수 있다!!!
      console.log(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // [결제취소 검증로직 테스트]
  // 1. 포인트 부족하지 않은지 검증
  // 2. 제대로 취소가 되는지
  // 3. 이미 취소된 아임포트id로 다시 취소요쳥 -> 에러 발생해야됨
}
