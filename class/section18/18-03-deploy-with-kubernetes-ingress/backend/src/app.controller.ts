// app.controller.ts

import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  getHello() {
    return '헬스체커 상태확인';
  }
}