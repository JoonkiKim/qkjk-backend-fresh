// aaa.spec.ts

// 1. 한개 테스트하기
it('더하기 테스트', () => {
  const a = 1;
  const b = 2;

  expect(a + b).toBe(3);
});

// 2. 여러개 묶음으로 테스트하기
describe('나의 테스트 그룹', () => {
  it('더하기 테스트', () => {
    const a = 1;
    const b = 2;

    expect(a + b).toBe(3);
  });

  it('곱하기 테스트', () => {
    const a = 1;
    const b = 2;

    expect(a * b).toBe(2);
  });
});

// 3. 기능 테스트하기
// 상품구매하기 테스트 예제
describe('상품구매테스트', () => {
  // 각 기능을 실행하기 전에 초기화해야할 것들을 실행해주는게 before시리즈인거임

  // beforeAll(() => {}); // 모든 it들 실행하기 전에 딱 '1번' 실행(로그인 같은거)

  // beforeEach(() => {}); // 각각의 it들 실행하기 전에 '매번' 실행하고 초기화를 반복 (초기값 설정같은거)

  beforeEach(() => {
    // 각 it에서 사용할 초기값 설정
  });

  it('돈검증하기', () => {
    const result = true; // 돈이 충분하다고 가정
    expect(result).toBe(true);
  });

  it('상품구매하기', () => {
    const result = true; // 상품을 구매했다고 가정
    expect(result).toBe(true);
  });
});
