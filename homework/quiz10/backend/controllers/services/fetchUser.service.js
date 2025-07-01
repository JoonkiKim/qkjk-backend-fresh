import { User } from "../../models/user.model.js";

export class FetchUserService {
  fetchUser = async () => {
    const result = await User.find(
      {},
      { name: 1, email: 1, personal: 1, prefer: 1, phone: 1, og: 1, _id: 0 }
    );

    return result;
  };
}
