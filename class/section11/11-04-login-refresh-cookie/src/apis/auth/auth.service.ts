// 여기서 액세스 토큰뿐만 아니라 리프레시 토큰도 만들어주자

import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import {
  IAuthServiceGetAccessToken,
  IAuthServiceLogin,
  IAuthServiceSetRefreshToken,
} from './interfaces/auth-service.interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,

    private readonly usersService: UsersService,
  ) {}

  async login({
    email,
    password,
    context,
  }: IAuthServiceLogin): Promise<string> {
    // 1. 이메일이 일치하는 유저를 DB에서 찾기
    const user = await this.usersService.findOneByEmail({ email });

    // 2. 일치하는 유저가 없으면?! 에러 던지기!!!
    if (!user) throw new UnprocessableEntityException('이메일이 없습니다.');

    // 3. 일치하는 유저가 있지만, 비밀번호가 틀렸다면?!
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다.');

    // 4. refreshToken(=JWT)을 만들어서 브라우저 쿠키에 저장해서 보내주기
    this.setRefreshToken({ user, context });

    // 위의 setRefreshToken에서 setHeader를 통해 헤더에 쿠키정보를 넣어줬고, 아래의 return값이 바디가 되고, 헤더에 쿠키 정보가 담긴채로 res가 나간다
    // 5. 일치하는 유저도 있고, 비밀번호도 맞았다면?!
    //    => accessToken(=JWT)을 만들어서 브라우저에 전달하기
    return this.getAcessToken({ user });
    // 정리하면 액세스토큰은 리턴된 응답값으로 받고 리프레시토큰은 쿠키에 자동으로 저장된다
  }

  // 리프레시 토큰 발급 함수
  setRefreshToken({ user, context }: IAuthServiceSetRefreshToken): void {
    // 얘는 리턴타입이 없으니까 일단 void로 해주고, user, context에 대한 타입은 기존에 지정되어있는 타입들을 활용해서 IAuthServiceSetRefreshToken에 작성해준다
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      // 나중에 이런 비밀번호들은 env에 다 빼둬야한다
      { secret: '나의리프레시비밀번호', expiresIn: '2w' },
    );

    // 개발환경

    // 아까 context로 받아온 res를 여기서 조작해준다
    context.res.setHeader(
      'set-Cookie',
      `refreshToken=${refreshToken}; path=/;`,
      // path는 해당 쿠키가 어떤 경로에서 사용될건지 알려주는것 , path=/ 는 /로 '시작'하는 모든 주소에서 리프레시토큰을 사용한다는 뜻
    );

    // [배포환경에서는 아래와 같이 작성하자]
    // domain은 내가 배포할 사이트 주소(앞에 점.을 꼭 붙여줘야한다), 주소가 틀리면 쿠키를 전달 안하게 만들 수 있다
    // context.res.setHeader('set-Cookie', `refreshToken=${refreshToken}; path=/; domain=.mybacksite.com; SameSite=None; Secure; httpOnly`);
    // 누가 사용가능한지 명확하게 지정해주는 부분 -> 뒤쪽에 프론트엔드(브라우저) 주소를 작성해준다
    // context.res.setHeader('Access-Control-Allow-Origin', 'https://myfrontsite.com');
  }

  getAcessToken({ user }: IAuthServiceGetAccessToken): string {
    return this.jwtService.sign(
      { sub: user.id },
      { secret: '나의비밀번호', expiresIn: '1h' },
    );
  }
}

// 이 상태로 로그인을 하면 리프레시토큰이 브라우저 쿠키에 자동으로 저장되고, 앞으로 별다른 설정을 안해도 req header에 자동으로 해당 토큰이 담겨서 들어간다
