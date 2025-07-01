// auth.service.ts

import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import {
  IAuthServiceGetAccessToken,
  IAuthServiceLogin,
} from './interfaces/auth-service.interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, // 여기서 jwt의존성 주입을 받는다

    private readonly usersService: UsersService,
  ) {}
  // users서비스를 주입받아서 이메일 찾기 함수를 여기서 사용한다

  async login({ email, password }: IAuthServiceLogin): Promise<string> { // Promise<string>인 이유는 리턴값이 엑세스토큰인데 그건 스트링타입이고 근데 만드는데까지 기다려야하니까 Promise를 붙인다
    // 1. 이메일이 일치하는 유저를 DB에서 찾기
    const user = await this.usersService.findOneByEmail({ email });

    // 2. 일치하는 유저가 없으면?! 에러 던지기!!! -> 나중에 배포할때는 이렇게 구체적으로 주지 말고 서버 에러 등으로 퉁쳐서 메시지를 줘야 해커들이 막 달려들지 않는다
    if (!user) throw new UnprocessableEntityException('이메일이 없습니다.');

    // 3. 일치하는 유저가 있지만, 비밀번호가 틀렸다면?!
    // compare(password, user.password)여기서 앞쪽이 브라우저에서 유저가 입력한 비밀번호, 뒤쪽이 해시되어있는 값 => 그 둘을 비교하는거임
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다.');

    // 4. 일치하는 유저도 있고, 비밀번호도 맞았다면?!
    //    => accessToken(=JWT)을 만들어서 브라우저에 전달하기
    return this.getAcessToken({ user });

    // 이렇게 토큰 만들어주는 로직을 아래에 함수로 빼는게 재사용하기 좋다
  }


    // sign이 토큰 만들어주는 함수이고 앞쪽{}는 내가 넣고 싶은 데이터, 뒤쪽은 비밀번호같은거. 이때 앞쪽 데이터에 중요한 정보는 넣으면 안된다
    // nestjs독스에 따르면 유저아이디는 sub에 넣으라고 해서 저렇게 넣었다
    // return this.jwtService.sign(
    //   { sub: user.id },
    //   { secret: '나의비밀번호', expiresIn: '1h' },
    // secret은 비밀번호인데 그건 무조건 저렇게 써줘야하고, expiresIn은 만료시간임, 1s 1m 1h 등이 가능하다
  getAcessToken({ user }: IAuthServiceGetAccessToken): string {
    return this.jwtService.sign(
      { sub: user.id },
      { secret: '나의비밀번호', expiresIn: '1h' },
    );
  }
}

// 위에서 this.usersService.findOneByEmail({ email });의 리턴값이 User타입이고 그걸 user변수에 담았고, getAcessToken({ user }:여기서 user변수를 받아서 그중 id값을 sub: user.id에 담은거니까 IAuthServiceGetAccessToken에서 user에 대한 타입을 User로 지정한거임. 여기서 사용하는 user.id는 실제 존재하는 유저의 id인거임!
