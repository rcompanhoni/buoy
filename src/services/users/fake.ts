import FakeService from "services/base/fakeService";
import { PaginatedUsers } from "./interface";

const mockedUsers = [
  {
    id: 1,
    firstName: "Emily",
    lastName: "Johnson",
    email: "emily.johnson@x.dummyjson.com",
    image: "https://dummyjson.com/icon/emilys/128",
  },
  {
    id: 2,
    firstName: "Michael",
    lastName: "Williams",
    email: "michael.williams@x.dummyjson.com",
    image: "https://dummyjson.com/icon/michaelw/128",
  },
];

export class UsersFakeService extends FakeService<PaginatedUsers> {
  constructor(latencyDuration = 0, errorProbability = 0) {
    super(latencyDuration, errorProbability);
  }

  async getAll() {
    return this.simulateRequest(
      () => ({
        list: mockedUsers,
        total: mockedUsers.length,
      }),
      () => {}
    );
  }
}
