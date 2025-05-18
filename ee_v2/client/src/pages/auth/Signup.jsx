import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { Subtitle } from "@/components";
import { motion } from "framer-motion";
import { images } from "@/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks";

const Signup = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    }
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const navigate = useNavigate();
  const { signup, loading, error } = useAuth();

  const onSubmit = async (data) => {
    try {
      // Remove confirmPassword as it's not needed for API
      const { confirmPassword, ...signupData } = data;

      console.log("User Form Data: ", data);
      
      const res = await signup(signupData).unwrap();
      toast.success(res?.message || "Account created successfully!");
      navigate("/auth/signin");
    } catch (err) {
      toast.error(err?.message || "Registration failed. Please try again.");
      console.error("Registration error:", err);
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
                <Subtitle Subtitle="Signup" />
              </div>
            </motion.div>

            <motion.h2
              className="text-4xl text-center font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent font-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Create Account
            </motion.h2>
          </div>

          {/* Error display */}
          {error && (
            <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{error}</p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-sm font-medium font-body"
                >
                  First Name
                </Label>
                <div className="relative group mt-3">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  <Input
                    id="firstName"
                    {...register("firstName", { 
                      required: "First name is required",
                      minLength: { value: 2, message: "First name must be at least 2 characters" }
                    })}
                    className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                    placeholder="First name"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-sm font-medium font-body"
                >
                  Last Name
                </Label>
                <div className="relative group mt-3">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  <Input
                    id="lastName"
                    {...register("lastName", { 
                      required: "Last name is required",
                      minLength: { value: 2, message: "Last name must be at least 2 characters" }
                    })}
                    className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                    placeholder="Last name"
                  />
                </div>
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Contact Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium font-body"
                >
                  Email
                </Label>
                <div className="relative group mt-3">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  <Input
                    id="email"
                    {...register("email", { 
                      required: "Email is required",
                      pattern: { 
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                        message: "Invalid email address" 
                      }
                    })}
                    className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                    placeholder="Email address"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium font-body"
                >
                  Mobile Number
                </Label>
                <div className="relative group mt-3">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  <Input
                    id="phone"
                    {...register("phone", { 
                      required: "Mobile number is required",
                      pattern: { 
                        value: /^[0-9]{10}$/, 
                        message: "Please enter a valid 10-digit mobile number" 
                      }
                    })}
                    className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                    placeholder="Mobile number"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
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
                    type={showPassword.password ? "text" : "password"}
                    {...register("password", { 
                      required: "Password is required",
                      minLength: { value: 6, message: "Password must be at least 6 characters" }
                    })}
                    className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                    placeholder="Create password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        password: !prev.password,
                      }))
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword.password ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-orange-500 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-orange-500 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium font-body"
                >
                  Confirm Password
                </Label>
                <div className="relative group mt-3">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  <Input
                    id="confirmPassword"
                    type={showPassword.confirmPassword ? "text" : "password"}
                    {...register("confirmPassword", { 
                      required: "Please confirm your password",
                      validate: value => value === watch("password") || "Passwords do not match"
                    })}
                    className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        confirmPassword: !prev.confirmPassword,
                      }))
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword.confirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-orange-500 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-orange-500 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <Button
              className="w-full h-12 bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white font-medium rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <motion.div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating Account...
                </motion.div>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="relative text-center pt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative">
                <span className="px-4 bg-white text-sm text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.01 }}>
              <Button
                variant="outline"
                className="w-full h-12 border-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium rounded-xl cursor-pointer"
                type="button"
                onClick={() => navigate("/auth/signin")}
              >
                Sign In
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Signup;