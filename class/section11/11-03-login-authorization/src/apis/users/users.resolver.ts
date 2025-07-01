// users.resolver.ts

import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';

import { GqlAuthAccessGuard } from '../auth/guards/gql-auth.guard';
import { IContext } from 'src/commons/interfaces/context';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService, //
  ) {}

  // 인가가 필요한 부분을 알아보기 위해 유저정보불러오기 함수를 만들어보자
  // 원래는 디비에서 불러오는거로 해야되는데 우리는 일단 인가 부분만 확인할거니까 콘솔로 찍어오기로 하자
  // 리졸버부분만 보면 똑같은 API이긴하다 -> 근데, 저번에 네스트 독스에서 봤던 request lifecycle을 보면 guard부분이 있다. 그 부분을 여기서 활용할거임
  // fetchUser API를 사용하기 전에 로그인을 했는지 안했는지 검증을 하기위한 방어막(UseGuards)을 아래와 같이 사용해준다
  // 괄호 안쪽에는 미리 등록되었있는 'access' 라는 방식을 사용해준다 -> 등록을 또 따로 해줘야됨 -> 이건 auth폴더에서 만들거임

  // 정리하면 fetchUser함수에 프런트가 요청(req)을 하면 UseGuard를 만나고 'access' 방식의 인가를 통과하면 그때 fetchUser함수를 실행해주는거임
  // JwtAccessStrategy와의 연결은 'access'라는 이름을 통해서 되는거임
  // @UseGuards(AuthGuard('access')) // 이렇게만 하면 restapi방식이기 때문에, graphql을 위한 코딩을 더 해줘야된다
  // gql을 사용하기 위해 AuthGuard('access')대신 GqlAuthAccessGuard를 넣어준다
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => String)
  fetchUser(
    // context안에는 res와 req가 담겨있다
    @Context() context: IContext, //
  ): string {
    // 유저정보 꺼내오기
    console.log('==============');
    console.log(context.req.user); // GqlAuthAccessGuard를 통과했기 때문에 req안에 user가 담겨있다(원래는 없다) => 그래서 이걸 찍어보면 id값이 나오게 된다 => 즉 인가를 통과하여 유저정보'조회'를 성공했다!
    console.log('==============');
    return '인가에 성공하였습니다.';
  }

  @Mutation(() => User)
  async createUser(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('name') name: string,
    @Args({ name: 'age', type: () => Int }) age: number,
  ): Promise<User> {
    return this.usersService.create({ email, password, name, age });
  }
}
