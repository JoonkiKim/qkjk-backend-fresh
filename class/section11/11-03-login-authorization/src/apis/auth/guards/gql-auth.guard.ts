// gql-auth.guard.ts

import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

// 이걸 해줘야 Gql로 받은 req를 restapi로 바꿔치기 할 수 있다 => 다시말해 AuthGuard 내에 존재하는 getRequest 검증 함수를 사용하여  rest-api 용도의 함수를 graphql 용도의 함수로 바꿔줍니다(= overriding).
// AuthGuard를 바로 실행하는 것이 아니라 GqlAuthAccessGuard를 먼저 실행시켜서 통과되면 AuthGuard를 실행시키는 것입니다.

// 원래 AuthGuard('access')부분이 UseGuard안에 있었는데,그걸 여기서 넣고 대신 GqlAuthAccessGuard를 보내준다
export class GqlAuthAccessGuard extends AuthGuard('access') {
  getRequest(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext.getContext().req;
  }
}
