import { getToday } from "./utils.js";

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

export function sendWelcomeToEmail(email, welcome) {
  console.log(`${email} 로 가입환영 템플릿 "${welcome}" 를 전송합니다.`);
}
