import { useQuery } from "@tanstack/react-query";
import UsersService from "services/users";
import { PaginatedUsers } from "services/users/interface";

export function useGetUsers() {
  return useQuery<PaginatedUsers>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await UsersService.getAll();
      return {
        list: response.list,
        total: response.total,
      };
    },
    staleTime: 1000 * 60 * 5, // cache data for 5 minutes
    retry: 2, // retry twice on failure
  });
}
