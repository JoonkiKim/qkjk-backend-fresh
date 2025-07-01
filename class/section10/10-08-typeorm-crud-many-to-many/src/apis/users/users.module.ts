// users.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, // 이게 레파지토리 주입받는 부분! 여기서 받아서 service에서 사용하는거다
    ]),
  ],
  providers: [
    UsersResolver, //
    UsersService,
  ],
})
export class UsersModule {}
