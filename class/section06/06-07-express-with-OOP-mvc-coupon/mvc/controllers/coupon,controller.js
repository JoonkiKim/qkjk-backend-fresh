import { CashService } from "./services/cash.service";

export class CouponController {
  buyCoupon = (req, res) => {
    // 1. 가진 돈 검증하는 코드
    // 근데! 이거 서비스로 이미 만들어놨으니까 그대로 가져오면 된다
    const cashService = new CashService();
    const hasMoney = cashService.checkValue();

    // 2. 쿠폰 구매 코드
    if (hasMoney) {
      res.send("쿠폰 구매 완료");
    }
  };
}
