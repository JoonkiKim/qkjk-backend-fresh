// AuthGuard를 내부에서 동적으로 실행해주는 DynamicAuthGuard를 만들어보자
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

class GoogleAuthGuard extends AuthGuard('google') {}
const googleAuthGuard = new GoogleAuthGuard();

class NaverAuthGuard extends AuthGuard('naver') {}
const naverAuthGuard = new NaverAuthGuard();

class KakaoAuthGuard extends AuthGuard('kakao') {}
const kakaoAuthGuard = new KakaoAuthGuard();

export class DynamicAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const { social } = context.switchToHttp().getRequest().params;

    if (social === 'google') return googleAuthGuard.canActivate(context);
    if (social === 'naver') return naverAuthGuard.canActivate(context);
    if (social === 'kakao') return kakaoAuthGuard.canActivate(context);
  }
}
