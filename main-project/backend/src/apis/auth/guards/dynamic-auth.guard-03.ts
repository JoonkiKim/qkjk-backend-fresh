// 중복되는 부분을 더 더 없애보자
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

const DTNAMIC_AUTH_GUARD = {
  google: new (class extends AuthGuard('google') {})(),
  kakao: new (class extends AuthGuard('kakao') {})(),
  naver: new (class extends AuthGuard('naver') {})(),
};

export class DynamicAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const { social } = context.switchToHttp().getRequest().params;
    // social로 들어오는 값으로 각각 구글 네이버 카카오를 찾아주면 되니까 아래처럼 작성해준다
    return DTNAMIC_AUTH_GUARD[social].canActivate(context);
  }
}
