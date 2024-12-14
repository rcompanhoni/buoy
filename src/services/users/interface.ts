import { AuthedService } from "services/base/authedService";

export interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}

export abstract class UsersService extends AuthedService {
  abstract getAll(): Promise<UserData[]>;
}
