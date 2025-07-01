export function checkPhone(myphonenumber) {
  if (myphonenumber.length < 10 || myphonenumber.length > 11) {
    console.log("에러발생! 핸드폰 번호를 제대로 입력해주세요");
    return false;
  } else return true;
}

export function getToken() {
  const result = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");

  console.log(result);
  return result;
}

export function sendTokenToSMS(myphonenumber, result) {
  console.log(myphonenumber + "번호로 인증번호 " + result + "를 전송합니다.");
}
