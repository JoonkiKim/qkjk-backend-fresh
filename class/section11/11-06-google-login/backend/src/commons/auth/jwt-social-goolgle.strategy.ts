import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    // 여기서 우리가 구글 로그인 사용하겠다고 등록할때 받아온 클라이언트시크릿이이랑 백엔드유저 정보(클라이언트아이디디)를 PassportStrategy에 넘겨주면, 구글이 알아서 인가를 통과시키고 밑으로 보내서 acccessToken, refreshToken, profile를 줄거임
    // 구글로그인설명.png에서 삼각형부분은 알아서 다 처리가되는거고 우리는 맨 마지막에 accessToken이랑 프로필정보만 받아오면 되는거임
    super({
      clientID:
        '1061091729628-hljrj340i37rs7d7djruhasdj132qg1g.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: '/login/google', // 리디렉션 url은 https://localhost:3000 은 빼고 하는거임
      scope: ['email', 'profile'],
      // scope는 profile정보 중 어떤걸 받고 싶은지를 적어주는거임
    });
  }

  validate(acccessToken, refreshToken, profile) {
    console.log(acccessToken);
    console.log(refreshToken);
    console.log(profile);

    return {
      name: profile.displayName,
      email: profile.emails[0].value,
      hashedPassword: '1234',
      age: 0,
    };
  }
}
