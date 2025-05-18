import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { Subtitle } from "@/components";
import { motion } from "framer-motion";
import { images } from "@/assets";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks";
import { toast } from "react-toastify";

const Signin = () => {
  const navigate = useNavigate();
  const { signin, loading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userId: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  // Handle form submission with react-hook-form
  const onSubmit = async (data) => {
    try {
      const res = await signin(data).unwrap();
      toast.success(res?.message || "Successfully signed in!");

      console.log("User Data: ", res.user.role);
      const userRole = res?.user?.role;

      if (userRole === "admin") {
        navigate(`/${userRole}-dashboard`);
      } else if (userRole === "user") {
        navigate(`/${userRole}-dashboard`);
      }
    } catch (err) {
      toast.error(err?.message || "Failed to sign in. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-yellow-50"
    >
      <div className="w-full max-w-6xl p-8 flex items-center gap-12">
        {/* Left side - Image */}
        <motion.div
          className="flex-1 hidden lg:block"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <motion.div
              className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-orange-200 to-yellow-200 rounded-2xl transform rotate-3"
              animate={{ rotate: 3 }}
              transition={{ duration: 0.5 }}
            />
            <img
              src={images.travel1}
              alt="Travel illustration"
              className="relative w-full h-[600px] object-cover rounded-2xl shadow-xl"
            />
          </div>
        </motion.div>

        {/* Right side - Form */}
        <motion.div
          className="flex-1 bg-white p-8 rounded-2xl shadow-lg"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-8">
            <motion.div
              className="relative inline-block mb-4 ml-48 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute -top-1 -left-1 w-full h-full bg-orange-200 rounded-lg transform rotate-3" />
              <div className="relative bg-white px-6 py-2 rounded-lg border border-orange-300">
                <Subtitle Subtitle="Signin" />
              </div>
            </motion.div>

            <motion.h2
              className="text-4xl text-center font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent font-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Welcome Back
            </motion.h2>
          </div>

          {/* Error display */}
          {error && (
            <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          {/* Error messages from react-hook-form */}
          {errors.userId && (
            <p className="text-red-500 text-sm mb-2">{errors.userId.message}</p>
          )}
          {errors.password && (
            <p className="text-red-500 text-sm mb-2">
              {errors.password.message}
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="userId" className="text-sm font-medium font-body">
                User ID
              </Label>
              <div className="relative group mt-3">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                <Input
                  id="userId"
                  {...register("userId", {
                    required: "Login ID is required",
                    minLength: {
                      value: 3,
                      message: "Login ID must be at least 3 characters",
                    },
                  })}
                  className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                  placeholder="Enter your username or email"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label
                htmlFor="password"
                className="text-sm font-medium font-body"
              >
                Password
              </Label>
              <div className="relative group mt-3">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-orange-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-orange-500" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate("/auth/forgot-password")}
                className="text-sm text-orange-600 hover:text-orange-700"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              className="w-full h-12 bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white font-medium rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>

            <motion.div whileHover={{ scale: 1.01 }}>
              <Button
                variant="outline"
                className="w-full h-12 border-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium rounded-xl cursor-pointer"
                type="button"
                onClick={() => navigate("/auth/signup")}
              >
                Create Account
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Signin;