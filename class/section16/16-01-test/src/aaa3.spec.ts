// controller를 테스트하는 방법에 대해 알아보자
// aaa3.spec.ts
// 아까 aaa2에서는 테스트 코드를 만들때는 고전방식으로 서비스, 컨트롤러를 불러왔는데, 여기서는 Testing module을 만들어서 우리가 하던 편한 방식인 Dependency Injection을 구현해보자
// '@nestjs/testing'을 사용하면 자동으로 의존성을 주입할 수 있다!
// 처음에 봤던 app.controller.spec.ts 코드를 보면 이거랑 똑같이 생겼다!

import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  // 바깥에 변수 만들어서 밑에서 사용하는 패턴은 동일하다

  beforeEach(async () => {
    // TestingModule이 appmodule역할을 하는거임
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile(); // compile을 통해 의존성주입 같은게 이루어진다

    appController = app.get<AppController>(AppController);
  });

  describe('getHello', () => {
    it('이 테스트의 검증 결과는 Hello World를 리턴해야함!!!', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
