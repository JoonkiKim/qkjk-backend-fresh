// 여기에 서비스 만들어놓고 payment.module에 import해줘야된다

import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import axios from 'axios';
import {
  IIamportServiceCancel,
  IIamportServiceCheckPaid,
} from './interfaces/iamport-service-interface';

@Injectable()
export class IamportService {
  async getToken(): Promise<string> {
    // 리턴값이 accessToken이고 await를 쓰고 있으니까 Promise<string>로 리턴값타입스크립트를 작성해준다
    // try {
    // RESTAPI key&secret을 이용해서 액세스 토큰부터 받아오기
    const result = await axios.post(`https://api.iamport.kr/users/getToken`, {
      // 이 부분은 반드시 env로 빼야된다
      imp_key: process.env.IMP_KEY,
      imp_secret: process.env.IMP_SECRET,
    });
    return result.data.response.access_token; // 이렇게 토큰을 받아온다
    // } catch (error) {
    //   throw new HttpException(
    //     error.response.data.message,
    //     error.response.status,
    //   );
    // }
  }

  // [결제완료상태인지 검증하기]
  // 진짜 결제를 한게 맞는지 아임포트에서 조회해보는거임
  // impUid와 액세스토큰을 특정 주소로 보내서 데이터를 조회한다
  async checkPaid({ impUid, amount }: IIamportServiceCheckPaid): Promise<void> {
    //실제로 그 impUid로 결제되었는지 & amount가 정확한지 둘다 체크해야됨
    // try {
    // 1) impUid 검증하는 부분
    const token = await this.getToken();
    // result에는 데이터 검증결과가 담기는거임
    const result = await axios.get(
      `https://api.iamport.kr/payments/${impUid}`,
      {
        headers: {
          Authorization: token,
        },
      },
    );
    // 2) amount가 정확한지 검증하는부분
    if (amount !== result.data.response.amount) {
      throw new UnprocessableEntityException('잘못된 결제 정보입니다');
    }
    // [에러 통합하기]
    // amount !== result.data.response.amount에서 걸러지는 에러는 http에러이고, 위쪽에 만약에 axios에서 에러가 발생하면 그건 axios에러임 -> 두 결과가 다름, 따라서 아래로 내려가는 에러 메시지가 다름
    // } catch (error) {
    // message에 접근을 못해서 아래의 코드처럼 작성해줌
    // 여기서 메시지에 접근을 못했던 이유가 http에러랑 axios에러를 가져오는 방법이 달라서 그랬던거임
    // http에러는 error.response.message / error.response.statusCode, 이렇게 받아오는거고
    // Axios에러는 error.response.data.message, / error.response.status, 이렇게 받아오는거임
    // 기존에는 AxiosError는 common폴더에 만들어놓은 HttpException필터에 걸리지 않기 때문에 throw new HttpException으로 따로 작성해줘서 HttpException필터에 걸리게 만들어놓은거임 => 근데 이렇게 해주면 이번엔 http에러가 안 걸림. 왜냐면 가져오는 형식이 다르니까. 그래서 기존 코드에서 문제가 생겼던거임
    // 이걸 통합해주려면 옵셔널 체이닝 걸어주고, http에러와 Axios에러를 모두 써주면 되는거임 => 이렇게 해주면 둘다 HttpException필터에 걸려서 로그가 찍히게 된다
    // 이 방법의 문제는 매번 이렇게 둘다 써줘야된다는 점. 다른게 또있으면 또 써줘야됨 => HttpException필터에서 모든 예외를 통합해주면 됨 -> common 폴더의 Exception필터파일 보기

    // Exception필터 파일처럼 모든 예외에 대해 일괄처리가 가능하게 되면 try catch가 더이상 필요없게 됨!
    // throw new HttpException(
    //   error.response.data?.message || error.response.message,
    //   error.response.status || error.response.statusCode,
    // );
    // }
  }

  // [결제 취소하기]
  async cancel({ impUid }: IIamportServiceCancel): Promise<number> {
    // try {
    const token = await this.getToken();
    const result = await axios.post(
      'https://api.iamport.kr/payments/cancel',
      {
        imp_uid: impUid,
      },
      {
        headers: {
          Authorization: token,
        },
      },
    );

    // console.log('result.data.response', result.data.response.cancel_amount);
    // return result.data.response.cancel_amount;

    const { code, message, response } = result.data;
    if (code !== 0 || !response) {
      throw new UnprocessableEntityException(message ?? '결제 취소 실패');
    }
    return response.cancel_amount;

    // 취소할 결제금액의 양을 리턴으로 받아오는거임
    // } catch (error: unknown) {
    //   // message에 접근을 못해서 아래의 코드처럼 작성해줌
    //   if (error instanceof AxiosError && error.response) {
    //     // 진짜 HTTP 호출 실패
    //     throw new HttpException(
    //       error.response.data.message,
    //       error.response.status,
    //     );
    //   }
    //   // 이미 HttpException 혹은 UnprocessableEntityException 이라면 그대로 던지기
    //   throw error;
    // }
  }
}
