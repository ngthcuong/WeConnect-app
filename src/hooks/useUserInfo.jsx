import { useGetAuthUserQuery } from "@services/rootApi";

export const useUserInfo = () => {
  const response = useGetAuthUserQuery();
  return response.data;

  //   return useSelector((state) => state.auth.user);
};
