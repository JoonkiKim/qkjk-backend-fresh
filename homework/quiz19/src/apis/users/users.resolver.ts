// users.resolver.ts

import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { ForbiddenException, UseGuards } from '@nestjs/common';

import { IContext } from 'src/commons/interfaces/context';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
// import { DeleteUserOutput } from './dto/delete-user.output';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService, //
  ) {}
  @UseGuards(GqlAuthGuard('access'))
  @Query(() => User)
  fetchLoginUser(
    // context안에는 res와 req가 담겨있다
    @Context() context: IContext, //
  ): Promise<User> {
    // 유저정보 꺼내오기
    console.log('==============');
    console.log(context.req.user); // GqlAuthAccessGuard를 통과했기 때문에 req안에 user가 담겨있다(원래는 없다) => 그래서 이걸 찍어보면 id값이 나오게 된다 => 즉 인가를 통과하여 유저정보'조회'를 성공했다!
    console.log(context.res);
    const id = context.req.user.id;
    const res = this.usersService.findOneById({ id });
    console.log('==============');
    return res;
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.usersService.create({ createUserInput }); // password 길이 통과한 DTO
  }

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => User)
  async updateUser(
    @Args('userId') userId: string,
    @Args('updateProductInput') updateUserInput: UpdateUserInput,
    @Context() context: IContext,
  ): Promise<User> {
    if (context.req.user.id !== userId) {
      throw new ForbiddenException('You can update only your own profile.');
    }
    return this.usersService.update({ userId, updateUserInput });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => String)
  deleteUser(
    @Args('userId') userId: string, //
  ): Promise<string> {
    return this.usersService.delete({ userId });
  }
}
