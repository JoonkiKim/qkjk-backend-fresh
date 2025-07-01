// users.service.spec.ts

import {
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';

// 나만의 데이터베이스 만들기 (Repository만들기)
// UsersRepository를 모킹해서 사용하는거임. 이게 디비에 접속하는 역할을 한다고 가정하고 하는거임. 엄밀히 말하면 디비를 모킹하는게 아니라 디비에 접속할 수 있는 도구인 Repository를 모킹하는거임
class MockUsersRepository {
  mydb = [
    // '이미 존재하는 이메일 검증하기!!' 부분 테스트를 하기 위해서 'a@a.com'이 있는 디비 환경을 여기에 만들어주는거임
    { email: 'a@a.com', password: '0000', name: '짱구', age: 8 },
    { email: 'qqq@qqq.com', password: '1234', name: '철수', age: 12 },
  ];

  // 가짜 함수를 만들때는 필요한 부분만 만들면 된다
  // 실제 UsersRepository 안에 findOne함수가 있는데 그걸 여기서 가짜로 만들어주는거임
  findOne({ where }) {
    const users = this.mydb.filter((el) => el.email === where.email);
    if (users.length) return users[0]; // 해당 이메일이 있으면 그 이메일을 리턴하고
    return null; // 없으면 null을 리턴한다
  }

  // 실제 UsersRepository 안에 save함수가 있는데 그걸 여기서 가짜로 만들어주는거임
  save({ email, password, name, age }) {
    this.mydb.push({ email, password, name, age });
    return { email, password, name, age };
  }
}

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const usersModule = await Test.createTestingModule({
      // imports: [TypeOrmModule...],
      // 여기 이렇게 TypeOrmModule을 실제로 써버리면 진짜 디비에 접근해서 데이터를 조작하게 됨. 그니까 쓰면 안됨
      // controllers: [],
      providers: [
        UsersService, // 서비스로직은 그대로 가져와서 사용한다.

        // 디비부분만 모킹해서 여기에 넣어준다
        // User 레파지토리부분에 MockUsersRepository를 넣어달라고 선언하는 것
        {
          provide: getRepositoryToken(User),
          useClass: MockUsersRepository,
        },
      ],
    }).compile();

    usersService = usersModule.get<UsersService>(UsersService);
  });

  // 이건 실제로 디비에 접속해서 데이터를 가져오게 되니까 일단 사용하지 않는다
  //   describe('findOneByEmail', () => {
  //     const result = usersService.findOneByEmail({ email: 'a@a.com' });
  //     expect(result).toStrictEqual({
  //         email: "a@a.com",
  //         name: "짱구",
  //         ...
  //     })
  //   });

  // [에러가 잘 떨어지는지 확인하는 코드]
  describe('create', () => {
    // 이미 존재하는 이메일인지 확인하는 로직이 잘 작동하는지 테스트
    it('이미 존재하는 이메일 검증하기!!', async () => {
      const myData = {
        email: 'a@a.com',
        password: '1234',
        name: '철수',
        age: 13,
      };

      try {
        await usersService.create({ ...myData });
        // 여기서의  usersService.create는 실제 usersService의 이메일 검증 로직을 따라서 작동하는거고 그 필터링이 잘되는지를 여기서 확인하는거임 -> 모킹디비에 a@a.com이 있으니까 catch에 잡혀서 에러가 떨어질거임!!

        // [서비스 테스트 작동 로직!! 중요!!]정리하면
        // usersService.create를 요청하면 실제 users.service.ts에 있는 create함수에 요청이 들어가고 그 안에 있는 코드가 한줄씩 실행되며 findOneByEmail함수를 만나고 그 안에 있는 usersRepository.findOne이 실행되어야 하는데! -> 우리는 가짜 MockUsersRepository를 만들었으니까 그 안에 있는 findOne이 실행된다. 거기에 where자리에 이메일이 들어오고 그게 MockUsersRepository안쪽 디비에 존재하는지 확인해서 있으면 아래의 catch로 넘어가서 에러를 뱉어내는거임
      } catch (error) {
        // 에러가 예상되면 이렇게 expect안에 error를 넣어주면 되는거임
        expect(error).toBeInstanceOf(ConflictException);
        // ConflictException자리에는 실제users.service.ts에서 던져주는 에러 방식을 써주면 된다
        // expect(error).toBeInstanceOf(UnprocessableEntityException); // ConflictException가 아니라 UnprocessableEntityException를 넣으면 당연히 실패한다. 그니까 에러 코드도 잘 넣어서 테스트해야된다
      }
    });

    // [기능이 잘 작동하는지 확인하는 코드]
    // 회원등록기능이 잘 되는지 테스트하는 로직
    it('회원 등록 잘 됐는지 검증!!', async () => {
      const myData = {
        email: 'bbb@bbb.com',
        password: '1234',
        name: '철수',
        age: 13,
      };

      const result = await usersService.create({ ...myData });
      // 여기는 MockUsersRepository의 save까지 통과해야되는거임
      const { password, ...rest } = result;
      expect(rest).toStrictEqual({
        // jest에서 '객체'를 비교할때는 toBe가 아니라 toStrictEqual를 사용한다
        // 비밀번호 해싱되어서 들어가니까 expect할때 비밀번호는 빼고 비교한다
        // 있는거중에서 비교하는거니까 위쪽에 있는 save함수에서 password를 빼줄필요는 없다
        email: 'bbb@bbb.com',
        name: '철수',
        age: 13,
      });
    });
  });
});

// 중복확인테스트에서는 '에러'가 나오는지 확인하는게 중요한거고
// 등록테스트에서는 문제없이 등록되는지 확인하는게 중요한거다

// 그럼 디비를 모킹하는게 정답이냐? 마냥그렇지는 않음
// 테스트용 DB를 만들어서 하는게 낫지 않냐 라는 파와 지금처럼 모킹레파지토리만으로 충분하다는 파가 있음
// 전자는 오래걸린다.
