// users.service.ts

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  IUsersServiceCreate,
  IUsersServiceFindOneByEmail,
} from './interfaces/user-service.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findOneByEmail({ email }: IUsersServiceFindOneByEmail): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create({
    email,
    password,
    name,
    age,
  }: IUsersServiceCreate): Promise<User> {
    // 검증은 항상 서비스에서 진행하고 다 통과하면 리졸버로 보내준다!
    const user = await this.findOneByEmail({ email });
    if (user) throw new ConflictException('이미 등록된 이메일입니다.'); // 충돌 관련 에러는 ConflictException를 한다
    // if (user) throw new HttpException('이미 등록된 이메일입니다.', HttpStatus.CONFLICT); // 이렇게도 사용 가능

    // 이게 비밀번호 -> 해시 -> 솔트인데, 이것도 결국에 따로 서비스로 분리해서 재사용성을 높이긴 해야된다. 여기서는 더 안한다
    const hashedPassword = await bcrypt.hash(password, 10);
    // 이렇게 반복해서 하는걸 키스트레칭을 한다고 하는데 10을 적어줬으니 2의 10제곱만큼 진행한다

    return this.usersRepository.save({
      email,
      password: hashedPassword, // 여기서 전달해준다
      // 이렇게 저장하면 password셀에 애초에 해싱된 값이 저장된다
      name,
      age,
    });
  }
}
