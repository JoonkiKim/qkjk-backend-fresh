import {
  includeHyphenCheck,
  maskingLastSeven,
  sixTosevenCheck,
} from "../quiz1/id.js";

export function customRegistrationNumber(registrationNumber) {
  const isValid1 = includeHyphenCheck(registrationNumber);
  if (isValid1 === false) return;

  const isValid2 = sixTosevenCheck(registrationNumber);
  if (isValid2 === false) return;

  const maskedRegistrationNumber = maskingLastSeven(registrationNumber);

  // console.log(maskedRegistrationNumber);
  return maskedRegistrationNumber;
  // 리턴을 꼭 해주자!
}
