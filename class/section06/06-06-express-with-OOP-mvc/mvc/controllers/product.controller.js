import { CashService } from "./services/cash.service.js";
import { ProductService } from "./services/product.service.js";

// 컨트롤러 폴더는 보통 그 안에 services폴더를 만들어서 꺼내서 사용한다
// 서비스의 핵심로직 , 다시 말해 비즈니스 로직을 담고 있는건 서비스 폴더이다!

export class ProductController {
  buyProduct = (req, res) => {
    const cashService = new CashService();

    const hasMoney = cashService.checkValue();

    const productService = new ProductService();
    const isSoldOut = productService.checkSoldOut();

    if (hasMoney && !isSoldOut) {
      res.send("상품 구매 완료");
    }
  };

  refundProduct = (req, res) => {
    const productService = new ProductService();
    const isSoldOut = productService.checkSoldOut();

    if (isSoldOut) {
      res.send("상품 환불 완료");
    }

    res.send("Hello World");
  };
}
