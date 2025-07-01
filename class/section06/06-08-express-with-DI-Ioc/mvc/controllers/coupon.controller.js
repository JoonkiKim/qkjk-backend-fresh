export class CouponController {
  // 쿠폰 서비스도 의존성 주입을 통해 이렇게 쉽게 만들 수 있다
  cashService;

  constructor(cashService) {
    this.cashService = cashService;
  }
  buyCoupon = (req, res) => {
    // const cashService = new CashService();
    const hasMoney = this.cashService.checkValue();

    if (hasMoney) {
      res.send("쿠폰 구매 완료");
    }
  };
}
