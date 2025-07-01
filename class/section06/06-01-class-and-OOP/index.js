// 클래스와 객체지향프로그래밍에 대해 알아보자
// Date라는 '클래스'는 그 안에 있는 함수들에 대한 설명서이다. 이게 객체 형태로 출력되는데 이렇게 비슷한 함수들을 하나로 묶어서 관리하는걸 객체지향프로그래밍이라고 한다

// 예를 들어 const mymonster1 = new Monster();에서 mymonster1은 객체 혹은 인스턴스이고, Monster()는 설명서이다
// getFullYear와 getMonth는 메서드!

// class Date {
//     qqq = 10

//     getFullYear(){
//     }

//     getMonth(){
//     }
// }

// 클래스 안에서 함수 만들때는 function을 붙이지 않는다
// 변수 선언시에도 const 없이 바로 qqq = 10 이런 식으로 선언한다

const date = new Date();

console.log(date.getFullYear());
console.log(date.getMonth() + 1);

class Monster {
  power = 10;
  constructor(qqq) {
    this.power = qqq;
  }
  // 이렇게 화살표 함수로도 만들수있다
  attack = () => {
    console.log("공격하자!");
    // console.log("내 공격력은 " + power + "이다!")
    // 클래스에서는 위에처럼 변수를 그대로 가져다 쓸 수가 없음
    // class안에는 각 변수 및 함수에 this가 생략되어있기 때문에, 가져다 쓸때는 앞에 this를 붙여줘야 한다
    console.log("내 공격력은 " + this.power + "이다!");
  };

  run() {
    console.log("도망가자!");
  }
}
// 이렇게 클래스를 선언했다고 해서 바로 출력되는게 아니다. 왜냐면 클래스 문서는 설명서일 뿐이니까. 실행하려면 아래에 new Monster로 실행을 해줘야된다

const mymonster1 = new Monster(50);
mymonster1.attack();
mymonster1.run();

const mymonster2 = new Monster(20);
mymonster2.attack();
mymonster2.run();

// 만약에 같은 클래스로 두개의 객체를 만들었는데, 하나의 객체에서만 내용을 수정하고 싶다면?
// mymonster2의 power는 20으로 바꾸고 싶다면?
// 클래스를 새로 선언하는게 아니라 constructor함수를 안에 하나 만들어서 그거로 바꿔준다
// const mymonster2 = new Monster(20); 이렇게 하면 20이 constructor(qqq)의 qqq자리로 들어가서 실행되고 그 안에 있는 this.power = qqq 가 실행되면서 power가 20으로 바뀐다. 이렇게 매개변수를 이용하면 안쪽의 숫자를 바꿀 수 있다
