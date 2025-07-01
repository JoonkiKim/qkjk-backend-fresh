// users.module.ts

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';

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

  exports: [
    UsersService, // 이렇게 해주면 UsersService가 UsersMoudle에 담겨서 나간다 -> 그걸 auth에서 사용할 수 있게 되는거임
    // 레파지토리는 따로 안해줘도 되는데, 모듈을 통해 export하면 내장되어서 같이 나간다
  ],
})
export class UsersModule {}
