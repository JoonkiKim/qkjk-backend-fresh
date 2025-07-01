class Mycar {
  type = "Mercedes-Benz";
  horsepower = "245";
  color = "gray";

  throttle = () => {
    console.log(
      "나의 애마 " +
        this.color +
        "색 " +
        this.type +
        "! " +
        this.horsepower +
        "마력으로 출발하자!"
    );
  };

  break = () => {
    console.log(
      "나의 애마 " + this.color + "색 " + this.type + "! " + "브레이킹하자!"
    );
  };
}

const mycar = new Mycar();
mycar.throttle();
mycar.break();
