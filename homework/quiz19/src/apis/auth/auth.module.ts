// auth.module.ts

import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { GqlAuthGuard } from './guards/gql-auth.guard';
// import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [JwtModule.register({}), UsersModule],
  providers: [
    JwtAccessStrategy, // 여기서 주입하면 전역에서 사용가능
    // JwtRefreshStrategy,
    AuthResolver, //
    AuthService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
