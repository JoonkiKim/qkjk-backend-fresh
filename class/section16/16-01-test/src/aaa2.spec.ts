//  app.controller.ts의 테스트 코드를 작성해서 Testing 해보자
//  getHello가 결제하는 함수라고 했을때 돈있는지 검증, 조회 등 다른 할게 많이 있음, 그래서 describe안에 describe를 또 적어준다
// fetchBoard와 CreateBoard에서도 각 함수안에서 또 실행해야되는게 많이 있으니까 각각에 대해서도 describe를 만들어준다

// aaa2.spec.ts

import { AppController } from './app.controller';
import { AppService } from './app.service';

// AppController말고 boardcontroller, productcontroller등등 많이 있을테니까 이름도 그냥 AppController로 써준다
describe('AppController', () => {
  let appService: AppService;
  let appController: AppController;
  // 변수를 따로 만들어줘서 각각의 함수에서 이 변수에 접근할 수 있게 만들어준다

  beforeEach(() => {
    appService = new AppService();
    appController = new AppController(appService);
  });
  // [테스트코드에서도 의존성 주입]
  // nest가 아니기 때문에 고전 방식으로 하나씩 주입해주는거다 -> 다른 밑에 있는 함수에서도 똑같이 이 방식을 써야되기 때문에 beforeEach로 초기로 해놓고 좀 더 효율적으로 하는 것뿐이다
  // `describe`에 우리가 기능을 테스트 할 AppService와 AppController 주입을 위해 변수 선언을 해줍니다.그리고 `beforeEach`에 `AppService`와 `AppController`를 연결시켜 줍니다. 이제 서비스 주입이 되었기 때문에 API 기능 테스트를 진행 할 수 있습니다.

  describe('getHello', () => {
    it('이 테스트의 검증 결과는 Hello World를 리턴해야함!!!', () => {
      expect(appController.getHello()).toBe('Hello World!');
      // 실제 service에서 리턴하는 'Hello World!'가 나와야됨

      // appController.getHello()를 실행하면 의존성으로 받은 appService의 getHello를 실행하게 되는거임 -> nestjs구조랑 똑같은거라고 생각하면 됨
    });
  });

  // 나머지는 주석처럼 해보면 된다
  //   describe('fetchBoards', () => {
  //     const appService = new AppService();
  //     const appController = new AppController(appService);
  // => 위에서 해줬으니까 appService, appController 는 필요없다
  //     expect(appController.fetchBoards()).toBe('성공');
  //   });

  //   describe('createBoard', () => {
  //     const appService = new AppService();
  //     const appController = new AppController(appService);
  //     expect(appController.createBoard()).toBe('성공');
  //   });
});
