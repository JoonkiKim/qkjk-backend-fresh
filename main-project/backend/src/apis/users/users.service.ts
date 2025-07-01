// users.service.ts

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  IUsersServiceCreate,
  IUsersServiceDelete,
  // IUsersServiceDelete,
  IUsersServiceFindOneByEmail,
  IUsersServiceFindOneById,
  IUsersServiceUpdate,
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
  findOneById({ id }: IUsersServiceFindOneById): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create({ createUserInput }: IUsersServiceCreate): Promise<User> {
    const { email, password, name, age, phone } = createUserInput;
    const user = await this.findOneByEmail({ email });
    if (user) throw new ConflictException('이미 등록된 이메일입니다.');
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.usersRepository.save({
      email,
      password: hashedPassword,
      name,
      age,
      phone,
    });
  }

  async update({
    userId,
    updateUserInput,
  }: IUsersServiceUpdate): Promise<User> {
    const id = userId;
    const user = await this.findOneById({ id });
    const { password } = updateUserInput;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = this.usersRepository.save({
      ...user, // 수정 후 수정되지 않은 다른 결과값까지 모두 받고 싶을 때 사용
      ...updateUserInput,
      password: hashedPassword,
    });
    return result;
  }

  async delete({ userId }: IUsersServiceDelete): Promise<string> {
    const { affected } = await this.usersRepository.softDelete({ id: userId });

    if (!affected) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
    }

    return '유저 삭제에 성공했습니다.';
  }
}
