import { useQuery } from "@tanstack/react-query";
import UsersService from "services/users";
import { UserData } from "services/users/interface";

// Not using the useCRUDBuilder here because this hook is focused on fetching
// all users on the platform, independent of any brand context
export function useGetUsers() {
  return useQuery<UserData[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await UsersService.getAll();
      return response;
    },
    staleTime: 1000 * 60 * 5, // cache data for 5 minutes
    retry: 2, // retry twice on failure
  });
}
