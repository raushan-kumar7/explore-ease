import {
  changePassword,
  forgotPassword,
  getCurrentUser,
  resetPassword,
  signin,
  signout,
  signup,
} from "@/store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading, error } = useSelector(
    (state) => state.auth
  );

  return {
    isAuthenticated,
    user,
    loading,
    error,
    signin: (credentials) => dispatch(signin(credentials)),
    signout: () => dispatch(signout()),
    signup: (userData) => dispatch(signup(userData)),
    forgotPassword: (email) => dispatch(forgotPassword(email)),
    resetPassword: (token, newPassword) =>
      dispatch(resetPassword({ token, newPassword })),
    changePassword: (oldPassword, newPassword) => {
      dispatch(changePassword(oldPassword, newPassword));
    },
    getCurrentUser: () => dispatch(getCurrentUser()),
  };
};

export default useAuth;