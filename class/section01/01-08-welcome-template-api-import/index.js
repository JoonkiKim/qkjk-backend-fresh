// 퍼사드 패턴을 쓰고 있기 때문에 각 함수에 대한 세부적인 내용은 import를 통해 가져오면 된다

// 이렇게 코드를 분리해놓고, 메인 함수만 확인하면 되게 코드를 짜야 유지보수가 쉽다
import { checkEmail, welcomeTemplate, sendWelcomeToEmail } from "./email.js";

function createUser({ name, age, school, email }) {
  const isValid = checkEmail(email);
  if (isValid === false) return;

  const welcome = welcomeTemplate({ name, age, school });

  sendWelcomeToEmail(email, welcome);
}

const name = "철수";
const age = 12;
const school = "다람쥐초등학교";
const email = "a@a.com";
// const createdAt = "2025-01-07";

createUser({ name, age, school, email });

// 단축키
// 해당 함수 안으로 들어가기 : ctrl + 클릭
// 이전 이후 페이지로 돌아가기 : alt + 방향키

// yarn init을 해줘야 package.json이 생성된다
// package.json에 type: "module"을 해줘야 nodejs가 import를 이해할 수 있다
