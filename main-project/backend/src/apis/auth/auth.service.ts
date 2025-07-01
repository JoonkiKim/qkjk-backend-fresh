import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import {
  IAuthServiceGetAccessToken,
  IAuthServiceLogin,
  IAuthServiceRestoreAccessToken,
  IAuthServiceSetRefreshToken,
  // IAuthServiceRestoreAccessToken,
  // IAuthServiceSetRefreshToken,
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
  }: // context,
  IAuthServiceLogin): Promise<string> {
    // 1. 이메일이 일치하는 유저를 DB에서 찾기
    const user = await this.usersService.findOneByEmail({ email });

    // 2. 일치하는 유저가 없으면?! 에러 던지기!!!
    if (!user) throw new UnprocessableEntityException('이메일이 없습니다.');

    // 3. 일치하는 유저가 있지만, 비밀번호가 틀렸다면?!
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다.');

    // 4. refreshToken(=JWT)을 만들어서 브라우저 쿠키에 저장해서 보내주기
    this.setRefreshToken({ user, context });

    // 5. 일치하는 유저도 있고, 비밀번호도 맞았다면?!
    //    => accessToken(=JWT)을 만들어서 브라우저에 전달하기
    return this.getAccessToken({ user });
  }

  // 액세스토큰 '재발급' 함수
  restoreAccessToken({ user }: IAuthServiceRestoreAccessToken): string {
    return this.getAccessToken({ user });
    // 액세스 토큰을 만들어주는 함수는 아래에서 만든걸 가져다 쓰면 된다
  }

  // // 리프레시 토큰 발급 함수
  setRefreshToken({ user, context }: IAuthServiceSetRefreshToken): void {
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      // 나중에 이런 비밀번호들은 env에 다 빼둬야한다
      { secret: '나의리프레시비밀번호', expiresIn: '2w' },
    );

    // 개발환경

    context.res.setHeader(
      'set-Cookie',
      `refreshToken=${refreshToken}; path=/;`,
    );

    // [배포환경에서는 아래와 같이 작성하자]
    // domain은 내가 배포할 사이트 주소(앞에 점.을 꼭 붙여줘야한다), 주소가 틀리면 쿠키를 전달 안하게 만들 수 있다
    // context.res.setHeader('set-Cookie', `refreshToken=${refreshToken}; path=/; domain=.mybacksite.com; SameSite=None; Secure; httpOnly`);
    // 누가 사용가능한지 명확하게 지정해주는 부분 -> 뒤쪽에 프론트엔드(브라우저) 주소를 작성해준다
    // context.res.setHeader('Access-Control-Allow-Origin', 'https://myfrontsite.com');
  }

  getAccessToken({ user }: IAuthServiceGetAccessToken): string {
    return this.jwtService.sign(
      { sub: user.id },
      // { secret: '나의비밀번호', expiresIn: '1h' },

      { secret: '나의비밀번호', expiresIn: '1h' },
    );
  }
}
