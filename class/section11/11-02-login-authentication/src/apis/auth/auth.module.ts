// auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({}), // auth.service에서 JWTservice를 주입받을건데 그것도 어쨌든 서비스이기 때문에 여기서 의존성 주입을 해줘야된다

    UsersModule, // auth부분에서 users의 레파지토리와 서비스를 모두 사용해야되는데, import에 레파지토리 불러오고 provider에 서비스를 불러와서 각각 불러오는 방법도 있지만 만약에 다른 product같은 부분에서도 이 작업을 반복하면 코드가 복잡해짐 =>UsersModule을 통째로 불러오면 훨씬 깔끔하게 불러올 수 있음
    // 이때 UsersModule에서 export처리를 해줘야 여기서 불러올수있는데 관련 코드는 UsersModule을 보기
  ],
  providers: [
    AuthResolver, //
    AuthService,
  ],
})
export class AuthModule {}

// forRoot, forFeature, register 등 Module뒤에 붙어있는 함수는 해당 모듈을 변형시켜서 사용할 수 있게 만들어주는 애들이다
