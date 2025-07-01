import coolsms from "coolsms-node-sdk";
import { Token } from "./models/token.model.js";
// import mongoose from "mongoose";

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

export function sendTokenToSMS(myphonenumber, result) {
  const messageService = new mysms(
    "NCSEZED409EPFMIM",
    "SPGRVPTCWMOWZYP3WHCOUQXKDHFNAFTI"
  );
  // 이런 키는 깃허브에 올리면 안됨
  // 그래서 환경변수라는걸 만들어줌 .env

  messageService.sendOne({
    to: myphonenumber,
    from: "01056193997",
    text: `[from준기] 안녕하세요 요청하신 인증번호는 ${result}입니다`,
  });
}

// 이미 저장되어있는지 확인하는 로직
export async function isPhoneExist(myphonenumber) {
  try {
    // 핸드폰 번호가 이미 DB에 존재하는지 확인
    const result = await Token.findOne({ phone: myphonenumber });
    return result ? true : false;
  } catch (error) {
    console.error("Error checking phone existence:", error);
    return false;
  }
}
