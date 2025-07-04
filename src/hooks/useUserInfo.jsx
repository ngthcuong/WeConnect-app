import { useGetAuthUserQuery } from "@services/authApi";

export const useUserInfo = () => {
  const response = useGetAuthUserQuery();
  return response.data;

  //   return useSelector((state) => state.auth.user);
};
