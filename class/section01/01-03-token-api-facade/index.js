// 퍼사드 패턴으로 코드를 리팩토링해보자

// 코드 내용을 하나씩 읽을 필요없이 각각의 함수를 만들고 안에서 합쳐서 코드를 깔끔하게 만들고, 그 안의 내용이 궁금하면 그때 눌러서 확인해보자

// 따라서 함수 이름이 매애우 중요하다. 나중에는 복잡한 함수나 내용에 대해서만 주석을 달고, 퍼사드 안쪽에서는 함수자체가 주석의 역할을 해줘야된다

function checkPhone(myphonenumber) {
  if (myphonenumber.length < 10 || myphonenumber.length > 11) {
    console.log("에러발생! 핸드폰 번호를 제대로 입력해주세요");
    // checkPhone함수 안에서만 return을 해버리면 전체 함수가 멈추지 않고 checkPhone함수만 멈추니까 true false로 값을 넘겨줘서 그거로 멈춘다
    return false;
  } else return true;
}

function getToken() {
  const result = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");

  console.log(result);
  return result;
}

function sendTokenToSMS(myphonenumber, result) {
  console.log(myphonenumber + "번호로 인증번호 " + result + "를 전송합니다.");
}

// 이렇게 만들고 나면 createTokenOfPhone만 봐도 로직을 알 수 있게 된다. 만약에 로직을 바꾸고 싶으면 그때 해당 함수 안쪽으로 들어가서 코드를 수정하면 된다
function createTokenOfPhone(myphonenumber) {
  // 1. 휴대폰번호 자릿수 맞는지 확인하기(10~11자리) "검증"
  const isValid = checkPhone(myphonenumber);
  if (isValid === false) return;

  // 2. 핸드폰 토큰 6자리 만들기 (인증번호 6자리)
  const myToken = getToken();

  // 3. 해당 핸드폰 번호로 토큰 전송하기
  sendTokenToSMS(myphonenumber, myToken);
}

createTokenOfPhone("01012345678");

// 이렇게 하고 나면 나중에는 다른 사람의 코드를 유지보수할때는 createTokenOfPhone만 확인하면 된다!
