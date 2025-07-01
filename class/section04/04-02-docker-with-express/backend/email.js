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

// 여기서 css먹일때 네이버메일은 최신 디자인까지 다 들어오지만, 구글은 옛날 버전이 남아있으니까 그걸 감안하고 보내기-> 구 버전 html,css로 작성하는게 좋다, 최신 버전은 사용하지 않기

export function welcomeTemplate({ name, age, school }) {
  const mytemplate = `
           <html>
                <body>
                    <h1>${name}님 가입을 환영합니다!!!</h1>
                    <hr />
                    <div>이름: ${name}</div>
                    <div>나이: ${age}</div>
                    <div>학교: ${school}초등학교</div>
                    <div>가입일: ${getToday()}</div>
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
