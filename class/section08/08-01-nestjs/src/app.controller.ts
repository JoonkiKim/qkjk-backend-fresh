import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  // 서비스의 코드 변경사항에 따라 컨트롤러도 바뀌게 되니까 AppService부분을 '의존성'이라고 부르는데 원래는 이게 컨트롤러 안쪽에 있으면서 의존성이다가, 바깥에서 주입받는 형태로 변경되었다
  // private readonly를 쓰면 별다른 변수 선언없이 그대로 사용할 수 있다고 했음

  @Get('products/buy')
  getHello(): string {
    // const qqq = 3;
    // 왼쪽에 마켓플레이스에서 ESLint 다운받으면 vs코드에서도 보임
    return this.appService.getHello();
    // 위에서 this.appService에 담긴 AppService에서 qqq함수를 꺼내서 여기서 실행하는거임. 이때 리턴값이 스트링("Hello World")이니까 함수 뒤에 리턴값의 타입으로 : string를 적어준거임

    // 결과 값을 보고 싶으면 터미널에 yarn start:dev를 해주고 포스트맨으로 'products/buy'에 get요청을 보내면 위의 내용들이 실행되면서 "Hello World"가 출력된다(근데 겁나 오래 걸린다. 왜그럴까?)
    // WSL에서 실행이 너무 오래 걸려서 금방 하게 해주는 명령어를 추가해서 "CHOKIDAR_USEPOLLING=false nest start --watch"로 실행했더니 잘됨!! 아구 잘해따!
  }
}

// prettier를 저장할때마다 적용하고 싶고 & 다른 개발자들과 이 설정을 공유하고 싶으면, .vscode폴더를 위쪽에 만들어서 그안에 settings를 넣은다음에 관련 설정을 그 안에 작성해주면 -> 내가 .prettierrc에서 작성한 내용을 파일로 공유할 수 있다

// "singleQuote": true, => 따옴표 쓸때 한개만 쓰기기
// "trailingComma": "all", => 모든 객체의 끝에 콤마 넣기
// "tabWidth": 2 => 두칸으로 들여쓰기 하기

// 세미콜론; 도 자동으로 붙여주는데, 이게 필요한 이유는 변수 선언 뒤에 세미콜론이 없으면 map을 이용하지 못하는등 코드 구분을 자바스크립트가 잘 못할 가능성이 있음 그래서 어쩃든 필요하다!
