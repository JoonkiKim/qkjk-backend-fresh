import { Token } from "../../models/token.model.js";

export class CheckPhoneService {
  checkPhoneNumber = async (phone) => {
    // 1. 입력 받은 핸드폰 번호로 Tokens 문서를 검색해 해당 번호의 인증여부가 true인지 확인합니다
    const existingToken = await Token.findOne({ phone });

    // 핸드폰 번호가 없거나, isAuth가 false라면 클라이언트에 422 상태코드와 함께 에러 문구를 반환
    if (!existingToken || !existingToken.isAuth) {
      return false;
    } else return true;
  };
}
