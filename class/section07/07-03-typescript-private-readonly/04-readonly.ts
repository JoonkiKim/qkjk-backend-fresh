// // readonly는 접근은 다 가능, 수정은 다 불가능

// class Monster2 {
//   constructor(readonly power) {}
//   attack1 = () => {
//     console.log("공격하자!");
//     console.log("내 공격력은 " + this.power + "이다!"); // 안에서 접근 가능
//     this.power = 30; // 안에서도 수정은 불가
//   };
// }

// class 공중몬스터2 extends Monster2 {
//   attack2 = () => {
//     console.log("공격하자!");
//     console.log("내 공격력은 " + this.power + "이다!"); // 자식도 접근 가능
//     this.power = 30; // 자식이 수정 불가
//   };
// }

// const mymonster22 = new 공중몬스터2(20);
// mymonster22.attack1();
// mymonster22.attack2();
// console.log(mymonster22.power); // 밖에서 접근 가능
// mymonster22.power = 10; // 밖에서 수정 불가
