import { useSelector } from "react-redux";
import { selectIsAuth } from "../../features/auth/authSlice";

export const useAuth = () => {
  const isAuth = useSelector(selectIsAuth);
  const isAdmin = false;

  return { isAuth, isAdmin };
};
