export interface IAllergiesServiceFindByName {
  allergyNames: string[];
}

export interface IAllergiesServiceBulkInsert {
  names: {
    name: string;

    // name이 여러개 들어가있는 배열을 타입으로 만드는 방법
  }[];
}
