// 카카오 로그인 스트레테지

import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';
export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: 'dcad6e462d3f417995b4646ccc306b0f', // 카카오에서 clientID는 RESTAPI 키 를 가져오면됨
      clientSecret: 'g7z524Rs3y1KzZUbzyc8av0vvLnX9h9X', // 이건 비즈니스인증 -> 보안 -> 시크릿키 생성 하면됨
      callbackURL: 'http://localhost:3000/login/kakao',
      // scope: 'profile_nickname', // 카카오는 그냥 스코프 빼기
    });
  }

  validate(acccessToken: string, refreshToken: string, profile: Profile) {
    // 카카오에서는 프로필정보에 대한 타입도 지정해주니까 그거에 맞게 만들면된다다
    console.log(acccessToken);
    console.log(refreshToken);
    console.log(profile);

    return {
      name: profile.displayName, // 닉네임을 보여주려면 displayName을 쓰면됨
      email: '@',
      password: '1234',
      age: 0,
      phone: '01000000000',
    };
  }
}
