// mocking을 사용해보자
// 가짜 AppService를 만들어서 주입해보자
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// 이 부분이 가짜 AppService임
class MockAppService {
  getHello(): string {
    return '나는 가짜다!!!';
  }
}

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useClass: MockAppService,
        },
      ],
      // 그동안 providers안에 AppService를 썼다는건 provide: AppService,      useClass: AppService, 라고 써줬던거임.
      // AppService자리에 AppService를 넣어달라는뜻
      // 근데 여기서는 useClass부분에 MockAppService를 써줬으니까 AppService자리에 MockAppService를 '사용'하게 되는거임
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getHello', () => {
    it('이 테스트의 검증 결과는 Hello World를 리턴해야함!!!', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});

// 그럼 이런게 어디서 사용되냐
// 보통 DB쪽에서 많이 사용된다. 실제 db에 데이터를 저장하면 안되니까 가짜 db를 만들어놓고 class에 배열을 만들어놓고 거기에 push하고 조회해보고 이런 식으로 한다
