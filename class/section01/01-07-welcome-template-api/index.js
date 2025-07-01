// 지금까지 배운것으로 회원가입api를 만들어보자

function checkEmail(email) {
  if (!email) {
    console.log("이메일이 존재하지 않습니다");
    return false;
  }
  if (email.includes("@") === false) {
    console.log("이메일이 형식이 올바르지 않습니다");
    return false;
  } else return true;
}

function welcomeTemplate({ name, age, school, createdAt }) {
  const mytemplate = `
         <html>
              <body>
                  <h1>${name}님 가입을 환영합니다!!!</h1>
                  <hr />
                  <div>이름: ${name}</div>
                  <div>나이: ${age}</div>
                  <div>학교: ${school}초등학교</div>
                  <div>가입일: ${createdAt}</div>
              </body>
          </html>
      
      
      `;

  return mytemplate;
}

function sendWelcomeToEmail(email, welcome) {
  console.log(`${email} 로 가입환영 템플릿 "${welcome}" 를 전송합니다.`);
}

// 구조분해할당으로 받음
function createUser({ name, age, school, email, createdAt }) {
  // 1. 이메일이 정상인지 확인(1. 존재여부, 2. "@"포함여부)
  const isValid = checkEmail(email);
  if (isValid === false) return;

  // 2. 가입 환영 템플릿 만들기
  const welcome = welcomeTemplate({ name, age, school, createdAt });

  // 3. 이메일에 가입환영 템플릿 전송하기
  sendWelcomeToEmail(email, welcome);
}

const name = "철수";
const age = 12;
const school = "다람쥐초등학교";
const email = "a@a.com";
const createdAt = "2025-01-07";
// new Date로 시간 자동생성 숙제해보기

// 숏핸드로 전달
createUser({ name, age, school, email, createdAt });
