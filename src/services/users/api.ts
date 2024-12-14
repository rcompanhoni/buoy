import { PaginatedUsers, UsersService } from "./interface";

export class UsersApiService extends UsersService {
  async getAll() {
    const uri = "https://dummyjson.com/users";
    const response = await this.get(uri);
    return {
      list: response.users,
      total: response.total,
    } as PaginatedUsers;
  }
}
