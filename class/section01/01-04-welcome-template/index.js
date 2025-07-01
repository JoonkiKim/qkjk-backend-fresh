// 이메일 템플릿을 통해 백엔드 API와 브라우저의 관계에 대해 알아보자

// 템플릿 리터럴 안에 html코드를 입력해서 이메일로 전송하면, 이메일 안에서 html태그로 인식되어 실행된다

function getWelcomeTemplate({ name, age, school, createAt }) {
  const mytemplate = `
       <html>
            <body>
                <h1>${name}님 가입을 환영합니다!!!</h1>
                <hr />
                <div>이름: ${name}</div>
                <div>나이: ${age}</div>
                <div>학교: ${school}초등학교</div>
                <div>가입일: ${createAt}</div>
            </body>
        </html>
    
    
    `;

  console.log(mytemplate);
}

// 위는 백엔드 API 역할
// ---------------
// 아래는 브라우저 역할

const name = "철수";
const age = 10;
const school = "다람쥐초등학교";
const createAt = "2025-01-05";

getWelcomeTemplate({ name, age, school, createAt });

// 이렇게 브라우저에서 순서대로 데이터를 보내주면 백엔드에서는 그걸 받아서 이메일 템플릿에 넣어준다

// 여기서의 문제는 데이터를 하나빼먹었을때 그게 그대로 들어가게 된다는 것 ex. 학교를 빼먹으면 학교 템플릿 자리에 createAt자료가 들어간다

// { name, age, school, createAt }
// 이렇게 중괄호를 해주면 문제가 해결된다
// 하나 빠뜨리면 걔만 undefined가 뜨고 나머지는 제대로 들어간다
