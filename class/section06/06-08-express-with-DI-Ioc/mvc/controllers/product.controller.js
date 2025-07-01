// 의존성 주입에 대해 알아보자

// 기존에는 현금으로 결제하려고하다가, 포인트로 결제하는 식으로 사업모델을 변경했다고 해보자
// const cashService = new CashService();부분을 pointService로 바꾸면 됨. 하지만 저게 buyProduct,refundProduct만 있는게 아니라 비슷한게 20개 있다고 했을떄 19개만 바꾸고 실수로 1개를 남겨두면 위험한 상황이 발생함
// 이런 상황을 ProductController는 CashService에 "의존"하고 있다고 부름
// 그리고 여기서 CashService를 "의존성" 이라고 부른다

// 이걸 해결하려면 Service들을 Controller 내부에서 만들지 말고 바깥에서 인자로 받아오면 한번에 변경이 가능하니까 안전하다! constructor를 이용하면 class도 인자를 사용할 수 있다

// 이렇게 되면 index.js에서 CashService()를 PointService()로만 바꿔주면 한번에 변경가능하니까 안전하다!
// 이런걸 "의존성 주입"이라고 부른다 : 의존성을 바깥으로 보내서 여기 안쪽으로 주입해주니까
// Dependency-Injection (DI)
// Nest.js를 사용하면 개발자가 하는게 아니라 이 역할을하는게 아니라 Nestjs가 대신 해준다 -> 제어가 넘어갔기 때문에 "제어 역전(Inversion of Control)"이라고 부른다 => 그걸 해주는 기능 이름이"Ioc컨테이너"
// 알아서 new를 만들고 의존성을 주입해주는 기능인거임(알아서 DI를 해주는 도구)

// 의존성 주입의 장점
// 1. 의존성 주입으로 한번에 변경가능
// 2. new 한번으로 모든곳에서 재사용하니까 변수 선언 개수가 줄어들어서 메모리 효율적 (new CashService()같은 new선언 횟수가 줄어드니까!) => "싱글톤 패턴"
// 3. 쿠폰 쿠매 방식을 현금결제에서 포인트결제로 '한번에' 변경 가능

export class ProductController {
  cashService; // 이건 변수다!
  productService;
  constructor(cashService, productService) {
    // 바깥에서 여러개를 받고 싶으면 매개변수를 여러개 쓰면 된다!
    this.cashService = cashService;
    // index.js에서 전달받은 const cashService = new CashService()를 여기서 전달받는다
    this.productService = productService;
  }

  buyProduct = (req, res) => {
    // const cashService = new CashService(); 이 부분을 바깥에 index.js에서 선언해주는거다!
    // [부가설명]
    // 1. 컨트롤러 내부에서 new를 선언하는 방식은 의존성이 높기 때문에 "강한 결합(tight-coupling)"이라고 부른다
    // 2. 의존성 주입 후 바깥에서 의존성을 주입받으면 의존성이 낮아졌기 때문에 "느슨한 결합(loose-coupling)"이라고 부른다
    // 3. 의존성 주입으로 싱글톤 패턴이 가능해졌다고 했는데, 그럼 "의존성 주입이면 싱글톤 패턴인가?" => 그건 아님. 왜냐면 예를 들어 바깥에서 cashService1, cashService2를 만들어서 다른 곳에 각각 넣어주면 의존성을 주입한건 맞지만, 싱글톤은 아니다. 왜냐면 다른 변수로 선언해서 다르게 사용하고 있으니까

    const hasMoney = this.cashService.checkValue();

    // const productService = new ProductService();
    const isSoldOut = this.productService.checkSoldOut();

    if (hasMoney && !isSoldOut) {
      res.send("상품 구매 완료");
    }
  };

  refundProduct = (req, res) => {
    // const productService = new ProductService();
    const isSoldOut = this.productService.checkSoldOut();

    if (isSoldOut) {
      res.send("상품 환불 완료");
    }

    res.send("Hello World");
  };
}
