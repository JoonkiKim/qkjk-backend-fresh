// 타입스크립트 제네릭에 대해 알아보자
// 제네릭 타입은 함수의 입력 값에 대한 타입과 출력 값에 대한 타입이 동일한지 검증할 수 있게 해준다
// 저번시간에 GraphQLModule.forRoot<ApolloDriverConfig>({~ 이 코드에서 ApolloDriverConfig를 썼는데 이게 제네릭 타입이다

// 함수에서의 타입스크립트로 알아보자

// 1. 문자,숫자,불린 기본타입
// 함수에서는 타입추론이 안되니까 함수쪽에서 미리 타입을 선언해줘야된다
// 리턴값에 대한 타입은 화살표함수의 괄호 옆에 : 로 적어준다
// 이 함수에서는 줄바꿈하면 보기 힘드니까 prettierrc에서서 "printWidth": 200를 적어줘서 200열이 넘어가야 줄바꿈이 되도록 수정
const getPrimitive = (arg1: string, arg2: number, arg3: boolean): [boolean, number, string] => {
  return [arg3, arg2, arg1];
};

const result1 = getPrimitive("철수", 123, true);

//
// 2. any 타입 => 그냥 자바스크립트랑 같음
//
const getAny = (arg1: any, arg2: any, arg3: any): [any, any, any] => {
  console.log(arg1 + 100); // 이렇게 하면 문자에 숫자를 더하는건데 타입스크립트에서 그냥 넘어가게 됨 => any는 아무거나 다 가능하니까 위험함!
  return [arg3, arg2, arg1];
};

const result2 = getAny("철수", 123, true);

// 3. unknown 타입
//
const getUnknown = (arg1: unknown, arg2: unknown, arg3: unknown): [unknown, unknown, unknown] => {
  if (typeof arg1 === "number") console.log(arg1 + 100);
  // unknown는 그냥 arg1 + 100를 하려고 하면, 뭐가 들어올줄알고 이걸 시키냐? 라고 에러를 뱉음. 그니까 typeof arg1 === "number"를 넣어줘서 제한을 두면 그때는 에러가 안남
  return [arg3, arg2, arg1];
};

const result3 = getUnknown("철수", 123, true);

// 4. generic 타입
// 제네릭은 우리가 타입을 만들어주는 것
// **그냥 쓰면 안되고 함수이름 뒤에 <> 로 이런 타입을 쓸거라고 선언해줘야됨
// 작동 방식은, 함수로 어떤 값이 들어오면 그 값에 대한 타입으로 각 제네릭 타입이 자동으로 설정되는거임.
// 들어오는 값으로 타입을 설정할 수도 있지만, 미리 선언할 수도 있음 => 아래처럼 실행하는 함수쪽에 <> 로 타입을 직접 적어주는거임
// getGeneric<string, number, boolean>("철수", 123, true); 이렇게 하면 MyType1는 스트링, MyType2는 넘버, MyType3는 불린타입이 된다
function getGeneric<MyType1, MyType2, MyType3>(arg1: MyType1, arg2: MyType2, arg3: MyType3): [MyType3, MyType2, MyType1] {
  return [arg3, arg2, arg1];
}

const result4_1 = getGeneric("철수", 123, true);

// 4. generic 타입2
// 타입이름을 더 간단하게 쓰기
function getGeneric2<T1, T2, T3>(arg1: T1, arg2: T2, arg3: T3): [T3, T2, T1] {
  return [arg3, arg2, arg1];
}

const result4_2 = getGeneric2("철수", 123, true);

// 4. ** generic 타입3
// 타입이름을 더더더 간단하게 쓰기 -> 그냥 알파벳 하나로만 써도 된다
function getGeneric3<T, U, V>(arg1: T, arg2: U, arg3: V): [V, U, T] {
  return [arg3, arg2, arg1];
}

const result4_3 = getGeneric3("철수", 123, true);

// 4. ** generic 타입4
// 타입스크립트 제네릭을 화살표 함수에서 활용하기
// = 은 함수명 바로 뒤에 붙여준다
const getGeneric4 = <T, U, V>(arg1: T, arg2: U, arg3: V): [V, U, T] => {
  return [arg3, arg2, arg1];
};

const result4_4 = getGeneric4("철수", 123, true);

// 저번시간에 썼던 GraphQLModule.forRoot<ApolloDriverConfig>를 자세히 보면 forRoot가 함수 이름이고 ApolloDriverConfig가 제네릭 타입 이름이고, {driver: ApolloDriver,autoSchemaFile: 'src/commons/graphql/schema.gql',} 이거는 입력값에 객체가 들어간거임
// 제네릭 함수인 어떤 함수의 타입을 미리 선언해줄 수 있었던 것처럼, 여기서는 forRoot함수의 타입은 ApolloDriverConfig로 쓸거라고 '미리' 선언해준거임 , 실제 함수 안쪽의 타입은 제네릭으로 되어있을거고

// 제네릭타입은 그럼 왜 사용하는걸까?
// 라이브러리 제공자가 사용자가 어떤 값을 넣고 싶은지 모르니까 함부로 타입을 만들 수가 없음 => 당신들이 뭘 넣을지모르겠지만 일단 넣고 싶은거 넣으세요. 대신 제네릭으로 해놓겠습니다. any보다는 안전하니까. 이렇게 된거임
