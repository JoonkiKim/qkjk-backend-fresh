export interface IUsersServiceCreate {
  email: string;
  password: string;
  name: string;
  age: number;
  phone: string;
}

export interface IUsersServiceFindOneByEmail {
  email: string;
}
