import { getToday } from "./utils.js";

import nodemailer from "nodemailer";

export function checkEmail(email) {
  if (!email) {
    console.log("이메일이 존재하지 않습니다");
    return false;
  }
  if (email.includes("@") === false) {
    console.log("이메일이 형식이 올바르지 않습니다");
    return false;
  } else return true;
}

export function welcomeTemplate({ name, phonenumber, preference }) {
  const mytemplate = `
           <html>
                <body>
                    <h1>${name}님 가입을 환영합니다!!!</h1>
                    <hr />
                    <div>이름: ${name}</div>
                    <div>전화번호: ${phonenumber}</div>
                    <div>좋아하는 사이트: ${preference}</div>
                    <div>가입일: ${getToday()}</div>
                </body>
            </html>
        
        
        `;

  return mytemplate;
}

// 이메일 인증 완료 메시지 전송 시 사용하는 함수
export async function sendWelcomeToEmail(myemail, welcome) {
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;
  const EMAIL_SENDER = process.env.EMAIL_SENDER;
  // createTransport는 메일을 전송하는 주체를 만들어주는 거임
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
      // 여기에 있는 것도 env에 넣어주기
    },
  });

  // 여기는 메일을 직접 보내는 부분
  const res = await transporter.sendMail({
    from: EMAIL_SENDER,
    to: myemail,
    subject: "가입을 축하합니다!",
    html: welcome,
  });

  console.log(res);
}
