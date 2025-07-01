// 백엔드 API는 검증 인증 보안 등의 역할을 주로 한다. 따라서 프론트에서 휴대폰 번호를 받고, 토큰을 통해 인증하고, 가입하는 과정을 만들어보면서 백엔드의 역할에 대해 이해해보자

// 여기서는 API의 검증 단계에 대해 알아보자

// 아래 코드처럼 작성하면 if문 지옥에 빠지니까 유지보수가 어렵다
// function createTokenOfPhone(qqq) {
//   // qqq는 매개변수(parameter)

//   // 1. 휴대폰번호 자릿수 맞는지 확인하기(10~11자리)
//   if (qqq.length >= 10) {
//     if (qqq.length <= 11) {
//       // 2. 핸드폰 토큰 6자리 만들기 (인증번호 6자리)
//       const result = String(Math.floor(Math.random() * 1000000)).padStart(
//         6,
//         "0"
//       );

//       console.log(result);

//       // 3. 해당 핸드폰 번호로 토큰 전송하기
//       // 여기서는 일단 가라로 한다
//       console.log(qqq + "번호로 인증번호 " + result + "를 전송합니다.");
//     } else {
//       console.log("에러발생! 핸드폰 번호를 제대로 입력해주세요");
//     }
//   } else {
//     console.log("에러발생! 핸드폰 번호를 제대로 입력해주세요");
//   }
// }

// 좋은 예! 아래의 코드처럼 작성하세요

// 에러인 경우를 먼저 만들어서 맨위에 써준다 => early-exit패턴
function createTokenOfPhone(qqq) {
  // qqq는 매개변수(parameter)

  // 1. 휴대폰번호 자릿수 맞는지 확인하기(10~11자리) "검증"
  if (qqq.length < 10 || qqq.length > 11) {
    console.log("에러발생! 핸드폰 번호를 제대로 입력해주세요");
    return;
  }

  // 2. 핸드폰 토큰 6자리 만들기 (인증번호 6자리)
  const result = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");

  console.log(result);

  // 3. 해당 핸드폰 번호로 토큰 전송하기
  // 여기서는 일단 가라로 한다
  console.log(qqq + "번호로 인증번호 " + result + "를 전송합니다.");
}

createTokenOfPhone("01012345678"); // 인자(argument)

// 우분투 터미널에서 특정 폴더로 한번에 들어가는법
// 해당 폴더에서 우클릭 -> 통합터미널에서 열기
