// auth.resolver.ts

import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { IContext } from 'src/commons/interfaces/context';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService, //
  ) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: IContext, // Request와 Response, header 등에 대한 정보들이 context에 존재하니까 리졸버에 일단 이걸 담아준다
  ): Promise<string> {
    return this.authService.login({ email, password, context });
  }
}
