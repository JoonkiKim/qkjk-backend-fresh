// 클래스 상속에 대해 알아보자

// 다른 몬스터를 만들고 싶은데, 기존 몬스터의 속성과 거의 다 똑같고 run함수만 다른거로 바꾸고 싶다면 그때 상속을 활용하자

const date = new Date();

console.log(date.getFullYear());
console.log(date.getMonth() + 1);

class Monster {
  power = 10;
  constructor(qqq) {
    this.power = qqq;
  }
  attack = () => {
    console.log("공격하자!");
    console.log("내 공격력은 " + this.power + "이다!");
  };

  run() {
    console.log("도망가자!");
  }
}

// 이렇게 extends로 상속한다
class 공중몬스터 extends Monster {
  // run함수의 내용만 바꾸고 싶으면 이렇게 한번더 선언해주면 덮어씌워진다
  // 이걸 "오버라이딩" 이라고 부름

  // 만약에 new 공중몬스터(50)에서 받은 50이라는 값을 자식을 거쳐서 부모로 보내고 싶다면 아래처럼 constructor안에 "super"를 써서 그 안에 매개변수로 보내주면 된다. 여기서는 aaa+1이 부모의 qqq로 전달되어서 총 값은 51이 된다
  constructor(aaa) {
    // 클래스 상속에서 매개변수를 넘겨주는 명령어는 super
    super(aaa + 1);
  }

  run = () => {
    console.log("날아서 도망가자!");
  };
}

class 지상몬스터 extends Monster {
  run = () => {
    console.log("뛰어서 도망가자!");
  };
}

const mymonster1 = new 공중몬스터(50);
// 이렇게 attack(), power을 선언하면 부모의 것들을 다 가져온다. 컨스트럭터까지 적용된다.  하지만 run함수만 오버라이딩한 함수로 가져온다
mymonster1.attack();
mymonster1.run();

const mymonster2 = new 지상몬스터(20);
mymonster2.attack();
mymonster2.run();
