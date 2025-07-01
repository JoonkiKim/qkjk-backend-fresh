import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

interface IOAuthUser {
  user: {
    name: string;
    email: string;
    hashedPassword: string;
    age: number;
  };
}

@Controller()
export class AuthController {
  constructor(
    private readonly userService: UsersService, //
    private readonly authService: AuthService, //
  ) {}

  @UseGuards(AuthGuard('google'))
  @Get('/login/google')
  async loginGoogle(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
    // restapi는 context필요없이 req, res로 바로 꺼내올수 있음
  ) {
    // 프로필 받아온 다음, 로그인 처리해야하는 곳
    // 프로필 정보에 뭐가 담겨잇는지는 전략 파일에서 확인하는거다
    // 1. 회원조회 -> 우리 DB에 구글에서 받아온 이메일이 들어있는지 확인 (userService주입 받아서 거기에 있는 함수로 한다)
    let user = await this.userService.findOne({ email: req.user.email }); //findOne함수자체가 email로 조회하는거니까 email을 넣어준다
    // 2. 만약에 이메일이 없으면 우리가 그 이메일 이용해서 회원가입을 자동으로 해준다 -> 그러고 let으로 만든 user변수에 넣어준다
    if (!user)
      user = await this.userService.create({
        // name: req.user.name,
        // email: req.user.email,
        // hashedPassword: req.user.hashedPassword,
        // age: req.user.age,
        // 위에처럼 들어오니까 스프레드연산자 써주면 된다
        ...req.user,
      });
    // 위의 함수를 거치고 나면 user값는 항상 있게 되는거니까(있으면 있는거고, 없으면 회원가입으로 만들어주니까)
    // 3. 회원가입이 항상 되어있게 되었으니까, 그 유저로 로그인하기
    // 이때의 로그인이란 refreshToken, accessToken 만들어서 브라우저에 전송하는 것 => 다만 페이지 리디렉션을 해줘야해서 accessToken은 안 만든다
    // 리프레시 토큰 만드는건 setRefreshToken함수로 하기
    this.authService.setRefreshToken({ user, res });
    // res에 페이지 리다이렉트 정보를 넣어줘야된다 -> 리다이렉트해야되는 곳은 처음 브라우저가 있던 곳! (쿠키받아야해서 이름은 localhost로 해준다)
    res.redirect(
      'http://localhost:5500/class/section11/11-06-google-login/frontend/social-login.html',
    );
  }
}

// 프런트에서 '/login/google' 주소로 이동해서 요청을 날리면 일단 @UseGuards(AuthGuard('google'))를 통과해야되고 그 가드는 google-strategy에서 한다
