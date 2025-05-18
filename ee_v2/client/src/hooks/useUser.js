import {
  deleteAccount,
  getUserProfile,
  updateAvatar,
  updateProfile,
} from "@/store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";

const useUser = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.user);

  return {
    profile,
    loading,
    error,
    getUserProfile: () => dispatch(getUserProfile()),
    updateProfile: (userData) => dispatch(updateProfile(userData)),
    updateAvatar: (formData) => dispatch(updateAvatar(formData)),
    deleteAccount: () => dispatch(deleteAccount()),
  };
};

export default useUser;