import { CreateStarbucksInput } from '../dto/create-starbucks.input';

// 브라우저에서 들어오는 input값에 대한 타입도 지정해준다
export interface IStarbucksServiceCreate {
  createStarbucksInput: CreateStarbucksInput;
  // CreateBoardInput는 dto에서 만들어준 class인데, 클래스를 타입스크립트로 사용할 수 있기 때문에 여기 넣어준다
}
