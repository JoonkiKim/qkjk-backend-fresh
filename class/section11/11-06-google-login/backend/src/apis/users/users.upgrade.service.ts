import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findOne({ email }) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create({ email, hashedPassword: password, name, age }) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) throw new ConflictException('이미 등록된 이메일입니다.');
    // if(user) throw new HttpException("이미 등록된 이메일입니다.", HttpStatus.CONFLICT) // 이렇게도 가능

    return this.usersRepository.save({ email, password, name, age });
  }

  checkEmail({ user }) {
    if (!user) throw new UnprocessableEntityException('이메일이 없습니다.');
  }

  async checkPassword({ password, hashedPassword }) {
    const isAuth = await bcrypt.compare(password, hashedPassword);
    if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다.');
  }
}
