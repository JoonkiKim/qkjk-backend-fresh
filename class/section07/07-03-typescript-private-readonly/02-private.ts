// class Monster2 {
//   constructor(private power) {}
//   attack1 = () => {
//     console.log("공격하자!");
//     console.log("내 공격력은 " + this.power + "이다!"); // 안에서 접근 가능
//     this.power = 30; // 안에서 수정가능
//   };
// }

// class 공중몬스터2 extends Monster2 {
//   attack2 = () => {
//     console.log("공격하자!");
//     console.log("내 공격력은 " + this.power + "이다!"); // 자식이 접근 불가
//     this.power = 30; // 자식이 수정 불가가
//   };
// }

// const mymonster22 = new 공중몬스터2(20);
// mymonster22.attack1();
// mymonster22.attack2();
// console.log(mymonster22.power); // 밖에서 접근 불가
// mymonster22.power = 10; // 밖에서 수정 불가
