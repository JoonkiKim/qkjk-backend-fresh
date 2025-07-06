// app.controller.ts

import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  getHello() {
    return 'CICD 상태확인';
  }
}