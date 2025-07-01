// 중복되는 부분을 더 더 진짜 없애보자
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

const DTNAMIC_AUTH_GUARD = ['google', 'kakao', 'naver'].reduce((prev, curr) => {
  return { ...prev, [curr]: new (class extends AuthGuard(curr) {})() };
  // 객체의 키값에 변수를 넣으려면 [curr]처럼 대괄호를 써줘야된다
}, {});

//

export class DynamicAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const { social } = context.switchToHttp().getRequest().params;
    return DTNAMIC_AUTH_GUARD[social].canActivate(context);
  }
}
