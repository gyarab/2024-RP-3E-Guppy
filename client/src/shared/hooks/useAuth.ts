export const useAuth = () => {
  const accessToken = sessionStorage.getItem("accessToken");
  const isAuth = !!accessToken;
  const isAdmin = false; // TODO: data?.user.isAdmin ?? false

  return { isAuth, isAdmin };
};
