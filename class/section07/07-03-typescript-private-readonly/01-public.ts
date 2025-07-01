// // 타입스크립트 추가 기능에 대해 알아보자

// // public, private, protected, readonly

// 최종적으로 Nest.js에서 쓸건 private readonly !

// public은 안과 밖 모두에서 접근 및 수정 가능!
class Monster2 {
  //   power = 10;
  // constructor 매개변수 자리에 public, private, protected, readonly 중 하나라도 붙으면 위에 있는 변수 선언 부분(power = 10;)이 없어도 된다 -> 매개변수가 아니라 진짜 변수가 되어버린다...!

  constructor(public power) {
    // this.power = power;
    // public, private, protected, readonly가 들어가면 this.power도 없이 그냥 자동으로 그 내용들이 선언된다
    // 아래에서 그대로 this.power로 쓸 수있다
  }
  attack1 = () => {
    console.log("공격하자!");
    console.log("내 공격력은 " + this.power + "이다!");
    // public power로 받아왔으니까 this.power를 바로 쓸 수 있다다
  };
}

// // private을 쓰면, 나만되고 다른 애들은 안돼 라는거니까 상속받은 공중몬스터2에서는 power를 쓸 수 없다. 단순히 class 바깥에서도 못쓴다
// // protected를 쓰면 나와 상속받은 애들은 되고, class바깥에서는 안된다
// // readonly는 밖이든 안이든 읽기 불러오기는 되는데 값을 바꾸는건 안됨
// // private readonly 이면 나만되고, 밖에서는 안되고, 바꾸는것도 안됨(내 class안에서도 바꾸는게 안됨)

// class 공중몬스터2 extends Monster2 {
//   attack2 = () => {
//     console.log("공격하자!");
//     console.log("내 공격력은 " + this.power + "이다!");
//   };
// }

// const mymonster22 = new 공중몬스터2(20);
// mymonster22.attack1();
// mymonster22.attack2();
// mymonster22.power = 10;
