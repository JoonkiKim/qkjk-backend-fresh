// auth.resolver.ts

import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { IContext } from 'src/commons/interfaces/context';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService, //
  ) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: IContext,
  ): Promise<string> {
    return this.authService.login({ email, password, context });
  }

  //리스토어함수에서 해줘야할일
  // 1. 리프레시토큰 인가  -> 2. 액세스토큰 재발급
  @UseGuards(GqlAuthGuard('refresh')) // 이걸 통해서 1번 할일인 리프레시토큰을 인가해준다. 액세스토큰 부분에서 GqlAuthAccessGuard를 만들어서 인가 했던것처럼 리프레시 토큰 부분에서도 이걸 하나 만들어주는거다 -> 근데 함수로 만들어줬으니까 괄호안에 함수 이름을 넣어준다
  // GqlAuthGuard('refresh')에 대한 전략을 만들어주기 위해 strategy파일에 refresh라는 이름의 strategy를 하나 만들어준다
  // strategy에서 인가를 뚫고 아래로 내려오면 저 아래에서 액세스 토큰을 재발급(restore)해준다 -> 재발급 함수는 서비스에서 만든다
  @Mutation(() => String)
  restoreAcessToken(
    @Context() context: IContext, // user에 들어갈 값은 위의 strategy에서 만들어줬으니까 context통해서 뽑아와서 restoreAccessToken쪽으로 보내주면 된다
  ): string {
    return this.authService.restoreAccessToken({ user: context.req.user });
  }
}
