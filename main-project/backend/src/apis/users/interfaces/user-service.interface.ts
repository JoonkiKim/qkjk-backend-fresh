import { CreateUserInput } from '../dto/create-user.input';

import { UpdateUserInput } from '../dto/update-user.input';

// export interface IUsersServiceCreate {
//   email: string;
//   password: string;
//   name: string;
//   age: number;
//   phone: string;
// }

export interface IUsersServiceCreate {
  createUserInput: CreateUserInput;
}

export interface IUsersServiceFindOneByEmail {
  email: string;
}

export interface IUsersServiceUpdate {
  userId: string;
  updateUserInput: UpdateUserInput;
}

export interface IUsersServiceFindOneById {
  id: string;
}

export interface IUsersServiceDelete {
  userId: string;
}
