// 타입스크립트 데코레이터에 대해 알아보자

// 고양이 관련 기능을 만들어보자

function Controller(aaaaa: any) {
  console.log("===========");
  console.log(aaaaa);
  console.log("===========");
}

@Controller
// @Controller를 사용하려면 tsconfig.json에서 관련 설정을 해줘야된다
// "experimentalDecorators": true를 추가해주면된다
class CatsController {}

// 여기서 node index.ts 실행하면 에러가 난다
// ts-node를 설치해서 사용해야된다 -> 그냥 설치만 하면 안되고, package.json에 script로 명령어 추가해서 실행해줘야됨
// "scripts": {"start:dev": "ts-node index.ts"}, 이걸 package.json에 추가해주면 내 node_modules에서 ts-node를 찾는다

// 실행하면 아래와 같이 출력됨
// ===========
// [class CatsController]
// ===========

// @ 로 시작하는 데코레이터는 '함수'이고 그 안에 class로 시작하는 내용들이 들어간다
