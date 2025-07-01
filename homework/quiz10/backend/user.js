import nodemailer from "nodemailer";
import { Token } from "./models/token.model.js";

import axios from "axios";
import cheerio from "cheerio";
export async function checkPhoneNumber(phone) {
  // 1. 입력 받은 핸드폰 번호로 Tokens 문서를 검색해 해당 번호의 isAuth가 true인지 확인합니다
  const existingToken = await Token.findOne({ phone });

  // 핸드폰 번호가 없거나, isAuth가 false라면 클라이언트에 422 상태코드와 함께 에러 문구를 반환
  if (!existingToken || !existingToken.isAuth) {
    return false;
  } else return true;
}

export async function webScraping(prefer_site) {
  // 2. axios.get으로 https://www.naver.com에 데이터를 요청해서 html코드를 일단 받아오기 => "스크래핑"
  const result = await axios.get(prefer_site);

  const $ = cheerio.load(result.data);

  const ogData = {}; // 데이터를 저장할 객체

  // 스크래핑한 데이터를 객체에 담는 방법
  $("meta").each((index, el) => {
    const key = $(el).attr("property");
    const value = $(el).attr("content");
    if (key && key.includes("og:") && value) {
      const formattedKey = key.replace("og:", ""); // "og:" 제거
      ogData[formattedKey] = value; // 객체에 key-value 저장
    }
  });

  console.log(ogData); // 결과 출력

  return ogData;
}

export function welcomeTemplate({ name, email, prefer }) {
  const mytemplate = `
           <html>
                <body>
                    <h1>${name}님 가입을 환영합니다!!!</h1>
                    <hr />
                    <div>이름: ${name}</div>
                    <div>이메일: ${email}</div>
                    <div>좋아하는 사이트: ${prefer}</div>
                </body>
            </html>
        
        
        `;

  return mytemplate;
}

// 이메일 인증 완료 메시지 전송 시 사용하는 함수
export async function sendWelcomeToEmail(myemail, welcome) {
  // createTransport는 메일을 전송하는 주체를 만들어주는 거임
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "qkjk1508@gmail.com",
      pass: "azsrevkxskbvqbmi",
      // 여기에 있는 것도 env에 넣어주기
    },
  });

  // 여기는 메일을 직접 보내는 부분
  const res = await transporter.sendMail({
    from: "qkjk1508@gmail.com",
    to: myemail,
    subject: "가입을 축하합니다!",
    html: welcome,
  });

  console.log(res);
}
