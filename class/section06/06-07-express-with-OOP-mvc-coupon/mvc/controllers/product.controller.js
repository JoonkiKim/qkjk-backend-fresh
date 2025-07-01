import { CashService } from "./services/cash.service.js";
import { ProductService } from "./services/product.service.js";

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
