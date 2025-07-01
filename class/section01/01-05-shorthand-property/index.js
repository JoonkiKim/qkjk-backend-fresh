// 주는 쪽에서 중괄호를 씌우는 이유: 숏핸드 프로퍼티!

function qqq(aaa) {
  console.log(aaa);
  console.log(aaa.name);
  console.log(aaa.age);
  console.log(aaa.school);
}

const name = "철수";
const age = 12;
const school = "다람쥐초등학교";

// const profile = {
//   name: name,
//   age: age,
//   school: school,
// };

const profile = {
  name,
  age,
  school,
};

// 이렇게 숏핸드 프로퍼티로 표현해줄 수 있따
// 키와 밸류가 같아서 밸류를 생략함

// 이렇게 변수에 담아서 줄수도 있지만
qqq(profile);

// 통째로 객체를 보내줄 수 도 있다
qqq({ name, age, school });

// 결과는 모두 같다
