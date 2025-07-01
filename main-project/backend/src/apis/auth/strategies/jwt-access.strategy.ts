// jwt-access.strategy.ts

import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: '나의비밀번호',
      passReqToCallback: true,
    });
  }

  // ② 첫 번째 인자에 req, 두 번째에 payload가 들어옵니다.
  async validate(req: Request, payload: any) {
    // 1) 헤더에서 Bearer 토큰만 추출
    const authHeader = req.headers['authorization'] ?? '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
      throw new UnauthorizedException('토큰이 존재하지 않습니다.');
    }

    // 2) Redis에 해당 토큰이 로그아웃 처리되어 저장되어 있는지 확인
    //    key 전체를 "accessToken:<token>" 형태로 조회해야 합니다.
    const isLoggedOut = await this.cacheManager.get<string>(
      `accessToken:${token}`,
    );
    if (isLoggedOut) {
      throw new UnauthorizedException('이미 로그아웃된 액세스 토큰입니다.');
    }

    // 3) 유효한 토큰이라면 payload에서 user 정보(id 등)를 꺼내 반환
    return { id: payload.sub };
  }
}
