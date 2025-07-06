// point-transaction-serviced.interface.ts

import { IAuthUser } from 'src/commons/interfaces/context';

export interface IPointsTransactionsServiceCreate {
  impUid: string;
  amount: number;
  user: IAuthUser['user']; // 인가를 통해서 context로 받아오는 user는 인가정보에 들어있는 유저인거니까 항상 IAuthUser로 타입을 지정해준다
  // IAuthUser통해서 받아오는 id랑 User테이블에 저장되어있는 id가 id 값은 같음!!! 근데, 타입만 다른거임. 그 타입만 제대로 지정해주면 되는거고 값은 똑같은 값이 오는거니까 나중에 활용할때 잘 활용하기!
}
