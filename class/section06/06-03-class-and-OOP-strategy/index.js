// 클래스 전략패턴에 대해 알아보자
// 상속은 부품 여러개를 조합해서 조금씩 바꾸는거라면
// 전략패턴은 내부의 부품을 바꾸는 것

// 실무에서는 전략패턴을 더 많이 사용하니까, 이 부분에 포커싱을 하자

// 부품이 핵심이 되고 여러부품으로 자동차를 만든다면 상속을 쓰면되고,
// 자동자 몸통이 핵심이 되고 내부 부품을 조금씩 바꾸면 된다면 전략을 쓰면 된다

class 공중부품 {
  run = () => {
    console.log("날아서 도망가자");
  };
}

class 지상부품 {
  run = () => {
    console.log("뛰어서 도망가자");
  };
}

class Monster {
  power = 10;
  // 이렇게 초기값 없이 변수 저장할 수도 있다
  부품;

  constructor(qqq) {
    this.부품 = qqq;
    // new 공중부품()을 밑에서 받았고 그게 qqq로 들어와서 부품 변수에 들어간다. 그리고 아래의 run함수 안에서서 this.부품.run()을 실행하면, 예를 들어 공중부품의 run함수가 실행되는거임
  }
  attack = () => {
    console.log("공격하자!");
    console.log("내 공격력은 " + this.power + "이다!");
  };

  run() {
    // 받아온 부품을 실행하는 부분
    this.부품.run();
  }
}

// 이렇게 클래스 안에 또 클래스를 넣어주는 것. 그러면 Monster안에서 constructor로 받음.
const mymonster1 = new Monster(new 공중부품());
mymonster1.attack();
mymonster1.run();

const mymonster2 = new Monster(new 지상부품());
mymonster2.attack();
mymonster2.run();
