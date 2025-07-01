// users.resolver.ts

import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService, //
  ) {}

  @Mutation(() => User)
  async createUser(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('name') name: string,
    @Args({ name: 'age', type: () => Int }) age: number, // 이렇게 안하고 age: number만 해주면 나이가 소수점으로 들어온다. 그래서 Int로 명시해준다
  ): Promise<User> {
    return this.usersService.create({ email, password, name, age });
  }
}
