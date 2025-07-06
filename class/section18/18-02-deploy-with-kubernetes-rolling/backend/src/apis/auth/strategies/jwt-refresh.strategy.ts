// 리프레시토큰을 인가해주기 위한 stratey 클래스를 만들어보자
// Bearer에서 가져오는게 아니라 쿠키에서 리프레시토큰을 뽑아오고 그걸 검증해야된다

import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      // 쿠키 뽑아오는건 직접 함수를 만들어줘야된다
      jwtFromRequest: (req) => {
        console.log(req);
        const cookie = req.headers.cookie; // 쿠키에서 리프레시토큰을 뽑아오면 // refreshToken=asdlkfjqlkjwfdjkl이렇게 생겼으니까 앞에있는 refreshToken= 부분을 없애줘야됨
        const refreshToken = cookie.replace('refreshToken=', '');
        return refreshToken;
      },
      secretOrKey: '나의리프레시비밀번호', // 이 비밀번호는 auth service에서 만들어준 비밀번호 쓰는거임
    });
  }

  // 위의 리프레시를 지나서 통과하면 밑으로 가고 req.user생생되어서 그게 req에 담겨서 들어가게 되고 -> 그거로 accessToken을 재발급받는다

  validate(payload) {
    console.log(payload); // { sub: askljdfklj-128930djk }
    return {
      id: payload.sub,
    };
  }
}
