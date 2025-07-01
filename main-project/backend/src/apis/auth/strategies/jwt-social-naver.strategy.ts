// 네이버 로그인 스트레테지

import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-naver-v2';
export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: 'Y97qqKW7AzlUD7oRCdPe',
      clientSecret: '6sxeNINLER',
      callbackURL: 'http://localhost:3000/login/naver', // 네이버 리디렉션 url은 https://localhost:3000 은 넣고 하는거임
      scope: ['email', 'name'], // scope내용은 개발가이드 보고 만들면 됨
    });
  }

  validate(acccessToken: string, refreshToken: string, profile: Profile) {
    // 네이버에서는 프로필정보에 대한 타입도 지정해주니까 그거에 맞게 만들면된다
    console.log(acccessToken);
    console.log(refreshToken);
    console.log(profile);

    return {
      name: profile.name,
      email: profile.email,
      password: '1234',
      age: 0,
      phone: '01000000000',
    };
  }
}
