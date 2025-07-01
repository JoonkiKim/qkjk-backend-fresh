// 소셜 로그인 리팩토링을 해보자
// 오리지널 코드는 before-refactoring 파일에 있음

import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CreateUserInput } from '../users/dto/create-user.input';
import { DynamicAuthGuard } from './guards/dynamic-auth.guard-04';

interface IOAuthUser {
  user: CreateUserInput;
}

@Controller()
export class AuthController {
  constructor(
    private readonly userService: UsersService, //
    private readonly authService: AuthService, //
  ) {}

  // /login뒤에 : 을 써주면 매개변수로 받을 수 있다
  // 프런트에서 api주소를 요청하는거니까 백엔드에서는 이렇게만 써줘도 알아서 :social쪽으로 매개변수가 들어온다
  @Get('/login/:social')
  @UseGuards(DynamicAuthGuard) // 동적으로 로그인방식을 받을 수 있도록 DynamicAuthGuard만들어서 여기에 넣어준다
  async loginOAuth(
    // 이름도 loginOAuth로 통일해준다. 어차피 방식이 다 똑같으니까!
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    let user = await this.userService.findOneByEmail({ email: req.user.email });
    if (!user) {
      user = await this.userService.create({
        createUserInput: req.user, // <-- 여기서 key를 맞춰 줍니다
      });
    }

    this.authService.setRefreshToken({ user, context: { res } });

    res.redirect(
      'http://localhost:5500/main-project/frontend/login/index.html',
    );
  }
}
