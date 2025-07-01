// 중복되는 부분을 더 없애보자
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

class GoogleAuthGuard extends AuthGuard('google') {}
class NaverAuthGuard extends AuthGuard('naver') {}
class KakaoAuthGuard extends AuthGuard('kakao') {}

const DTNAMIC_AUTH_GUARD = {
  google: new GoogleAuthGuard(),
  kakao: new NaverAuthGuard(),
  naver: new KakaoAuthGuard(),
};

export class DynamicAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const { social } = context.switchToHttp().getRequest().params;
    // social로 들어오는 값으로 각각 구글 네이버 카카오를 찾아주면 되니까 아래처럼 작성해준다
    return DTNAMIC_AUTH_GUARD[social].canActivate(context);
  }
}
