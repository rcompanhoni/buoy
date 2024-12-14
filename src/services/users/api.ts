import { UsersService } from "./interface";

export class UsersApiService extends UsersService {
  async getAll() {
    const uri =
      "https://dummyjson.com/users?limit=0&select=id,firstName,lastName,email,image";
    const response = await this.get(uri);
    return response.users;
  }
}
