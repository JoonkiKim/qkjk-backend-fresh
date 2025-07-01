// 구조분해 할당 예제
// 받는 쪽에서 중괄호를 쓸 수 있는 이유는 구조분해할당으로 받기 때문이다

// 객체 구조분해할당
// 이름만 정확하게 써주면 되고 순서는 중요하지 않다다
// const profile = {
//   name: "철수",
//   age: 12,
//   school: "다람쥐초등학교",
// };

// const { name, school } = profile;
// console.log(name);
// console.log(school);

// // 1. 일반변수 전달하기
// // 아래의 함수는 const aaa = "사과" 와 같음
// function zzz(aaa) {
//   console.log(aaa);
// }
// zzz("사과");

// 2. 객체 전달하기
// 아래의 함수는 const aaa = basket 과 같음

// function zzz(aaa) {
//   console.log(aaa); // 객체 출력
//   console.log(aaa.apple); // 3
//   console.log(aaa.banana); //10
// }

// const basket = {
//   apple: 3,
//   banana: 10,
// };

// zzz(basket);

// 3. 객체 전달하기 => 구조분해할당 방식으로 전달하기
// const {apple, banana} = basket 이렇게도 할 수 있음
// basket을 구조분해할당으로 '받음'
function zzz({ apple, banana }) {
  console.log(apple); // 3
  console.log(banana); //10
}

const basket = {
  apple: 3,
  banana: 10,
};

zzz(basket);
// 요 아래쪽에도 숏핸드 프로퍼티를 통해 basket을 객체로 바꿔주면 중괄호로 감싼 모양이 됨

// ** 객체를 구조분해할당과 숏핸드프로퍼티를 사용하면, 하나가 빠져도 순서가 중요하지 않기 때문에 이름만 잘 적어주면 데이터가 밀리지 않고 안전한 코드를 작성할 수 있다
