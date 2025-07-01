export function includeHyphenCheck(registrationNumber) {
  // 1. 주민번호는 반드시 '-'를 포함해야 함
  if (!registrationNumber.includes("-")) {
    console.error("에러 발생!!! 형식이 올바르지 않습니다!!!");
    return false;
  } else true;
}

export function sixTosevenCheck(registrationNumber) {
  // 2.  주민번호가 앞 6자리, 뒤 7자리로 구성되어야 함
  if (!/^\d{6}-\d{7}$/.test(registrationNumber)) {
    console.error("에러 발생!!! 개수를 제대로 입력해 주세요!!!.");
    return false;
  } else true;
}

export function maskingLastSeven(registrationNumber) {
  // 3. 앞부분은 그대로 두고 뒷자리 가리기
  const [front, back] = registrationNumber.split("-");
  const maskedBack = back[0] + "******";
  const maskedRegistrationNumber = `${front}-${maskedBack}`;
  return maskedRegistrationNumber;
}
