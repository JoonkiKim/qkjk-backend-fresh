// jwt-access.strategy.ts

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

//  PassportStrategy는 extends로 상속받아 사용하는거다
// Strategy는 JWT기반의 인가처리를 담당하게 해주는것 -> PassportStrategy안에 그걸 넣어줬으니까 이제 PassportStrategy가 그걸 JWT기반의 인가처리를 담당하게 된다
// Strategy 뒤쪽에 인가 이름을 써주면된다 -> 'access'

// 만약 소셜 로그인을 하고 싶다면 import {KakaoStrategy} from 'passport-kakao'를 하고 Strategy자리에 넣어주기만 하면 된다. 그러면 PassportStrategy가 카카오 로그인을 담당하게 된다

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor() {
    // 지금 JwtAccessStrategy가 자식클래스이고, PassportStrategy가 부모클래스인데 자식에서 부모로 어떤 값을 넘겨주고 싶은 상황임 -> super를 사용해서 넘겨준다
    // super로 넘겨주는 값이 PassportStrategy로 넘어가서 검증이 이루어지게 된다. 즉 super로 넘겨주는건 jwt토큰이랑 비밀번호 자체인거고 그에 대한 검증 은 PassportStrategy에서 하는거임
    // 일치여부랑 만료시간 지났는지를 두개 확인한다
    super({
      // jwtFromRequest는 원래 함수이기 때문에 () => 같은 형태로 원래는 써야된다. 근데 토큰을 쉽게 뽑아오는 방법은 아래와 같다
      // fromAuthHeaderAsBearerToken는 Bearer를 붙여서 받아오는경우 사용하는 방법
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: '나의비밀번호',

      // [token 직접 뽑아오는 방법]
      // jwtFromRequest: (req) => {
      //           console.log(req);
      //           const temp = req.headers.Authorization; // Bearer sdaklfjqlkwjfkljas
      //           const accessToken = temp.toLowercase().replace('bearer ', '');
      //           return accessToken;
      //         },
    });
  }

  // 저 위쪽 부분이 실패하면 에러가 나오고, 성공하면 아래의 validate로 간다.
  // jwt토큰이 검증 성공을 하면 거기 담겨있는 유저아이디가 payload에 담기게 된다

  validate(payload) {
    console.log(payload); // { sub: askljdfklj-128930djk } 이런식으로 id가 들어온다
    return {
      id: payload.sub, // 이렇게 리턴해주면 됨 =>
      // 이때 fetchUser API로 return 되는 것이 아님!
      // context 안의 req에 user 키가 '자동으로' 만들어 지고 그안 에 email과 id 정보가 담긴 객체가 담겨서 return되는 것  => 프런트에서 받아온 req안에 user정보가 담긴다는 것 -> user안에 id: payload.sub가 담긴 형태의 req가 fetchUser API쪽으로 넘어가게 된다 (passport에서 user를 자동으로 만들어 주기에, 바꿀 수 없습니다).
    };
  }
}

// 얘를 의존성 주입을 해줘야되는데, 이건 어디서 주입을 해도 전역에서 사용할 수 있기 떄문에 독스를 따라 auth.module에서 주입을 해준다
