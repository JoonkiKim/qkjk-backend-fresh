// 인증번호 전송 API를 이용해서 문자를 보내보자

// 서버는 yarn start:dev 로 해보고,프런트는 open with live server로 해보자

// 문자 보낼땐 coolsms라는 라이브러리 사용하기
import coolsms from "coolsms-node-sdk";

const mysms = coolsms.default;

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

export async function sendTokenToSMS(myphonenumber, result) {
  const messageService = new mysms(
    "NCSEZED409EPFMIM",
    "SPGRVPTCWMOWZYP3WHCOUQXKDHFNAFTI"
  );
  // 이런 키는 깃허브에 올리면 안됨
  // 그래서 환경변수라는걸 만들어줌 .env

  // 한명한테 보낼땐 sendOne, 여러명한테 보낼땐 sendMany
  const res = await messageService.sendOne({
    to: myphonenumber,
    from: "01056193997",
    text: `[from준기] 안녕하세요 요청하신 인증번호는 ${result}입니다`,
  });

  console.log(res);
}
