// 타입스크립트를 실습해보자
// 설치는 크게 두가지를 해야됨
// 1. yarn add typescript --dev 로 설치
// 2. tsconfig.json 파일 만들기 (타입스크립트 페이지로 가서 추천 설정 붙여넣기)

// 타입 추론
// 명시적으로 타입을 지정 안해줘도 타입이 추론된다
let aaa = "안녕하세요";
// aaa = 3 이렇게 하면 에러가 난다

let bbb: string = "반갑습니다";
// bbb = 10;

// 이렇게 타입 추론이 되면 타입 명시가 필요 없는거냐? 그렇진 않음
// 아래처럼 문자를 추가해줘야 하는 경우 둘다 들어갈 수 있다고 선언해줘야됨
let ccc: number | string = 1000;
ccc = "1000원";

// 숫자 타입
let ddd: number = 10;
// ddd = "철수";

// 불린 타입
let eee = true;
eee = false;
// eee = "false"; // 이거는 값이 존재하기 때문에 true가 출력되므로, 타입스크립트를 통해 불린 값과 스트링 값을 구분해줘야된다

// 배열타입
let fff: number[] = [1, 2, 3, 4, 5]; // "안녕하세요"
let ggg: string[] = ["철수", "영희", "훈이"]; // 10 못들어감
let hhh: (string | number)[] = ["철수", "영희", "훈이", 10];

// 객체타입
interface IProfile {
  name: string;
  age: number | string;
  school: string;
  hobby?: string;
  // 필수가 아니어도 될때는 ? 를 넣어주면 된다
}
const profile: IProfile = {
  name: "철수",
  age: 8,
  school: "다람쥐초등학교",
};
// 그냥 값만 타입 추론이 된다
// 다른걸 넣고 싶다면 interface로 명시해주자

// 함수 타입
// 타입 추론이 불가능하다
// 함수는 함수 스스로 무조건 명시해야된다
// 리턴값에 대한 타입은 () 옆에 써준다 => 이게 중요한 이유는 결과값을 계산하는 경우가 있기 때문, 리턴 타입에 대한 예측이 가능하다
function add(num1: number, num2: number, unit: string): string {
  return num1 + num2 + unit;
}

const result = add(1000, 2000, "원");

// 화살표 함수타입
const add2 = (num1: number, num2: number, unit: string): string => {
  return num1 + num2 + unit;
};

const result2 = add(1000, 2000, "원");

// any타입 => 자바스크립트랑 똑같음. 타입스크립트를 안쓰는거다
let qqq: any = "철수";
qqq = 123;
qqq = true;
