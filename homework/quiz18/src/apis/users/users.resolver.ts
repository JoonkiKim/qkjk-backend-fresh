// users.resolver.ts

import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
// import { UseGuards } from '@nestjs/common';

// import { GqlAuthAccessGuard } from '../auth/guards/gql-auth.guard';
// import { IContext } from 'src/commons/interfaces/context';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService, //
  ) {}
  // @UseGuards(GqlAuthAccessGuard)
  // @Query(() => String)
  // fetchUser(
  //   // context안에는 res와 req가 담겨있다
  //   @Context() context: IContext, //
  // ): string {
  //   // 유저정보 꺼내오기
  //   console.log('==============');
  //   console.log(context.req.user); // GqlAuthAccessGuard를 통과했기 때문에 req안에 user가 담겨있다(원래는 없다) => 그래서 이걸 찍어보면 id값이 나오게 된다 => 즉 인가를 통과하여 유저정보'조회'를 성공했다!
  //   console.log('==============');
  //   return '인가에 성공하였습니다.';
  // }

  @Mutation(() => User)
  async createUser(
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('password') password: string,
    @Args({ name: 'age', type: () => Int }) age: number,
    @Args('phone') phone: string,
  ): Promise<User> {
    return this.usersService.create({ email, password, name, age, phone });
  }
}
