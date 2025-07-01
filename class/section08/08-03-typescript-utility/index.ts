// 유틸리티 타입에 대해 알아보자
// 기존에 있는 타입을 조작해서 새로운 타입을 만드는 것

interface IProfile {
  name: string;
  age: number;
  school: string;
  hobby?: string;
}

// hobby가 반드시 있어야 하는 타입이 필요하다고해보자. 복붙하는 방법이 있지만 그러면 중복해서 코드가 많이생기게됨. 수정사항이 있으면 동시에 다 바꿔야되니까 유지보수도 힘듦

// 유틸리티 타입을 통해 타입을 쉽게 변경할 수 있다

// 1.Partial타입
// 특정 인터페이스 안에있는 타입을 모두 있어도되고 없어도 되고로 만드는 것. 모든 항목에 ?를 붙여준다고 생각하면됨
type aaa = Partial<IProfile>;

// 2. Required타입
// 전체를 필수 입력으로 만든다
type bbb = Required<IProfile>;

// 3. Pick 타입
// 특정 타입만 골라서 사용
// 여기는 name, age만 골라서 하기
type ccc = Pick<IProfile, "name" | "age">;

// 4. Omit타입
// 특정 타입을 빼버리기
type ddd = Omit<IProfile, "school">;

// 5. Record타입
// 그 전에 Union타입을 알아야 된다. 특정 값으로 타입을 선언해주기 때문에 더 안전한 타입
type eee = "철수" | "영희" | "훈이"; // 이 세개를 합친다 => Union타입
let child1: eee = "영희"; // Union타입을 선언해주면 선언한 '그 값'만 들어갈 수 있음. 철수 영희 훈이는 들어갈 수 있지만 맹구는 못들어감
let child2: string = "사과"; // 반면 string타입으로 지정하면 다른게 다 들어가게 되어서 덜 안전하다

// 레코드 타입은 Union타입 지정 후 각각의 레코드에 타입을 또 지정해주는 것 => 키:밸류 의 형태로 나온다
type fff = Record<eee, IProfile>; // Record타입

// 6. 객체의 key들로 Union타입을 쉽게 만들기
type ggg = keyof IProfile; // 이렇게 하면 해당 프로필의 키가 뽑아짐 => name | age | school | hobby
let myProfile: ggg = "age";

// 7. type 과 interface의 차이
// interface는 같은 이름의 타입을 만들면 그 두개가 "합쳐짐" => 선언 병합 이라고 부름
// 인터페이스는 선언 병합 가능!!
interface IProfile {
  candy: number; // 선언 병합으로 위에서 만든 IProfile에 추가됨
}

// 8. 배운거 응용
// 위에서 만든 IProfile타입의 내용들은 필수 입력 안해도 되도록 수정 -> Partial
let profile: Partial<IProfile> = { candy: 10 };
