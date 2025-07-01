import { includeHyphenCheck, sixTosevenCheck, maskingLastSeven } from "./id.js";

export function customRegistrationNumber(registrationNumber) {
  const isValid1 = includeHyphenCheck(registrationNumber);
  if (isValid1 === false) return;

  const isValid2 = sixTosevenCheck(registrationNumber);
  if (isValid2 === false) return;

  const maskedRegistrationNumber = maskingLastSeven(registrationNumber);

  console.log(maskedRegistrationNumber);
}

// 함수 실행 예시
customRegistrationNumber("210510-1010101"); // "210510-1******" 출력
customRegistrationNumber("210510-1010101010101"); // "주민번호는 앞 6자리, 뒤 7자리로 구성되어야 합니다." 출력
customRegistrationNumber("2105101010101");
