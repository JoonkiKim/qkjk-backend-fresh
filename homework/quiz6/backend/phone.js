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
  const SMS_KEY = process.env.SMS_KEY;
  const SMS_SECRET = process.env.SMS_SECRET;
  const SMS_SENDER = process.env.SMS_SENDER;
  const messageService = new mysms(SMS_KEY, SMS_SECRET);
  // 이런 키는 깃허브에 올리면 안됨
  // 그래서 환경변수라는걸 만들어줌 .env

  // 한명한테 보낼땐 sendOne, 여러명한테 보낼땐 sendMany
  const res = await messageService.sendOne({
    to: myphonenumber,
    from: SMS_SENDER,
    text: `[from과제] 안녕하세요 요청하신 인증번호는 ${result}입니다`,
  });

  console.log(res);
}
