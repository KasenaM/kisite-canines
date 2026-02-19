import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { User, Mail, MapPin, ShieldAlert, Lock, UserPlus, LogIn } from "lucide-react";
import axiosInstance from "../../axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ReCAPTCHA from "react-google-recaptcha";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { motion, AnimatePresence } from "framer-motion";

function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [recaptchaKey, setRecaptchaKey] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();
  const { login, user } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleResetRecaptcha = () => {
    setRecaptchaToken("");
    setRecaptchaKey((prev) => prev + 1);
  };

  const onSubmit = async (data) => {
    if (!recaptchaToken) {
      toast.error("Please verify you're not a robot.");
      return;
    }

    setLoading(true);
    const endpoint = isSignUp ? "/auth/signup" : "/auth/login";
    const payload = isSignUp
      ? { ...data, recaptchaToken }
      : { email: data.email, password: data.password, recaptchaToken };

    try {
      const res = await axiosInstance.post(endpoint, payload);
      const { token, user: userData } = res.data;

      // Preparing success message
      const welcomeName = isSignUp ? data.name : (userData.name || "User");
      const msg = isSignUp 
        ? `Welcome aboard ${welcomeName}! Your account has been created successfully.` 
        : `Welcome back ${welcomeName}!`;
      
      setSuccessMsg(msg);

      // Store auth data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Timer to allow users to read the success message before redirecting
      setTimeout(() => {
        login(userData);
        navigate("/dashboard", { replace: true });
      }, 3000);

    } catch (err) {
      const message = err.response?.data?.message || "";

      // Reseting ReCAPTCHA on any error
      handleResetRecaptcha();

      if (message.includes("exists")) {
        setError("email", { type: "manual", message: "Email already registered." });
      } else if (message.toLowerCase().includes("password")) {
        setError("password", { type: "manual", message: "INCORRECT PASSWORD or invalid email" });
      } else if (message.toLowerCase().includes("user not found") || message.toLowerCase().includes("email")) {
        setError("email", { type: "manual", message: "Email not found or invalid." });
      } else if (message.includes("blocked")) {
        toast.error("Account blocked. Contact support.");
      } else {
        toast.error(message || "Authentication failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isSignUp ? "Sign Up - Kisite Canines" : "Login - Kisite Canines"}</title>
      </Helmet>

      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#4F6866',
            color: '#fff',
          }
        }}
      />

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-20">
        <div
          className={`bg-white rounded-2xl shadow-xl border border-gray-200 w-full transition-all duration-500 overflow-hidden ${
            isSignUp ? "max-w-3xl" : "max-w-md"
          }`}
        >
          {/* Header Section */}
          <div className="bg-[#4F6866] p-8 text-center text-white relative">
            <div className="absolute top-4 left-4 opacity-10">
              {isSignUp ? <UserPlus size={80} /> : <LogIn size={80} />}
            </div>
            <h2 className="text-2xl font-bold relative z-10">
              {isSignUp ? "Join the Family" : "Welcome Back"}
            </h2>
            <p className="text-gray-200 text-sm mt-2 relative z-10">
              {isSignUp ? "Create a Pet Parent account today" : "Sign in to manage your canine companions"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            <div className={isSignUp ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
              <InputField label="Email Address" icon={<Mail size={16} />} error={errors.email?.message}>
                <input
                  type="email"
                  {...register("email", { 
                    required: "Email required",
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email format"
                    }
                  })}
                  className={`w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 outline-none transition-all ${
                    errors.email ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-[#D7CD43]/50 focus:border-[#D7CD43]"
                  }`}
                  placeholder="name@example.com"
                />
              </InputField>

              {!isSignUp && (
                <PasswordField
                  label="Password"
                  icon={<Lock size={16} />}
                  register={register}
                  name="password"
                  visible={showPassword}
                  toggle={() => setShowPassword(!showPassword)}
                  error={errors.password?.message}
                  rules={{ required: "Password required" }}
                />
              )}
            </div>

            {isSignUp && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-[#4F6866] font-bold text-xs mb-6 flex items-center gap-2 uppercase tracking-widest">
                    <User size={16} /> Personal & Contact Info
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Full Name" error={errors.name?.message}>
                      <input
                        {...register("name", { required: "Name required" })}
                        className={`w-full p-3 bg-white border rounded-lg focus:ring-2 outline-none ${
                            errors.name ? "border-red-500" : "border-gray-200 focus:ring-[#D7CD43]/50"
                        }`}
                        placeholder="John Doe"
                      />
                    </InputField>

                    <div className="space-y-1.5">
                      <label className="block text-[#4F6866] text-xs font-bold uppercase ml-1">
                        Phone Number
                      </label>
                      <PhoneInput
                        country={"ke"}
                        enableSearch
                        onChange={(phone) => setValue("phone", phone, { shouldValidate: true })}
                        inputClass={`!w-full !h-[48px] !bg-white !rounded-lg ${errors.phone ? "!border-red-500" : "!border-gray-200"}`}
                        buttonClass="!bg-white !border-gray-200 !rounded-l-lg"
                      />
                      <input type="hidden" {...register("phone", { required: "Phone number required" })} />
                      {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.phone.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <InputField label="Physical Address" icon={<MapPin size={16} />} error={errors.address?.message}>
                        <input
                          {...register("address", { required: "Address required" })}
                          className={`w-full p-3 bg-white border rounded-lg focus:ring-2 outline-none ${
                            errors.address ? "border-red-500" : "border-gray-200 focus:ring-[#D7CD43]/50"
                          }`}
                          placeholder="Estate, House No, City"
                        />
                      </InputField>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                  <h3 className="text-red-800 font-bold text-xs mb-6 flex items-center gap-2 uppercase tracking-widest">
                    <ShieldAlert size={16} /> Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Contact Name" error={errors.emergencyName?.message}>
                      <input
                        {...register("emergencyName", { required: "Required" })}
                        className="w-full p-3 bg-white border border-red-200 rounded-lg focus:ring-2 focus:ring-red-400/20 focus:border-red-400 outline-none"
                      />
                    </InputField>

                    <InputField label="Relationship" error={errors.emergencyRelationship?.message}>
                      <input
                        {...register("emergencyRelationship", { required: "Required" })}
                        className="w-full p-3 bg-white border border-red-200 rounded-lg focus:ring-2 focus:ring-red-400/20 focus:border-red-400 outline-none"
                      />
                    </InputField>

                    <div className="md:col-span-2 space-y-1.5">
                      <label className="block text-red-800 text-xs font-bold uppercase ml-1">
                        Emergency Phone
                      </label>
                      <PhoneInput
                        country={"ke"}
                        onChange={(phone) => setValue("emergencyPhone", phone, { shouldValidate: true })}
                        inputClass="!w-full !h-[48px] !bg-white !border-red-200 !rounded-lg"
                        buttonClass="!bg-white !border-red-200 !rounded-l-lg"
                      />
                      <input type="hidden" {...register("emergencyPhone", { required: "Emergency phone required" })} />
                      {errors.emergencyPhone && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.emergencyPhone.message}</p>}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-[#4F6866] font-bold text-xs mb-6 flex items-center gap-2 uppercase tracking-widest">
                    <Lock size={16} /> Account Security
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PasswordField
                      label="Password"
                      register={register}
                      name="password"
                      visible={showPassword}
                      toggle={() => setShowPassword(!showPassword)}
                      error={errors.password?.message}
                      rules={{ 
                        required: "Password required", 
                        minLength: { value: 6, message: "Min 6 chars" } 
                      }}
                    />
                    <PasswordField
                      label="Confirm Password"
                      register={register}
                      name="confirmPassword"
                      visible={showConfirmPassword}
                      toggle={() => setShowConfirmPassword(!showConfirmPassword)}
                      error={errors.confirmPassword?.message}
                      rules={{
                        required: "Required",
                        validate: (val) => val === watch("password") || "Passwords do not match",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="py-2 flex justify-center scale-90 sm:scale-100">
              <ReCAPTCHA
                key={recaptchaKey}
                sitekey="6LdwWXwrAAAAAJaWDlSAbe1ZXbqen0XcOyGT5YAJ"
                onChange={(token) => setRecaptchaToken(token)}
              />
            </div>

            <div className="space-y-4">
                <button
                type="submit"
                disabled={loading || !!successMsg}
                className="w-full bg-[#D7CD43] hover:bg-[#c4ba3d] text-[#303A40] py-4 rounded-xl font-black uppercase tracking-widest flex justify-center items-center gap-3 shadow-lg shadow-[#D7CD43]/20 transition-all active:scale-[0.98] disabled:opacity-70"
                >
                {loading ? (
                    <>
                        <div className="animate-spin h-5 w-5 border-4 border-[#303A40]/30 border-t-[#303A40] rounded-full"></div>
                        <span>Processing...</span>
                    </>
                ) : isSignUp ? (
                    "Register Account"
                ) : (
                    "Sign In to Dashboard"
                )}
                </button>

                <AnimatePresence>
                    {successMsg && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg text-center text-sm font-bold shadow-sm"
                        >
                            {successMsg}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
          </form>

          <div className="p-8 pt-0 text-center">
            <p className="text-sm text-gray-500">
              {isSignUp ? "Already part of the family?" : "New to Kisite Canines?"}
              <button
                type="button"
                className="text-[#D7CD43] font-black uppercase tracking-tighter hover:underline ml-2 transition-all"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  reset();
                  clearErrors();
                  setSuccessMsg("");
                  handleResetRecaptcha();
                }}
              >
                {isSignUp ? "Login here" : "Create account"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

const InputField = ({ label, icon, children, error }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-2 text-[#4F6866] text-xs font-bold uppercase ml-1">
      {icon} {label}
    </label>
    {children}
    {error && <p className="text-red-500 text-[10px] font-bold ml-1 uppercase">{error}</p>}
  </div>
);

const PasswordField = ({ label, icon, register, name, visible, toggle, error, rules }) => (
  <div className="space-y-1.5 w-full">
    <label className="flex items-center gap-2 text-[#4F6866] text-xs font-bold uppercase ml-1">
      {icon || <Lock size={16} />} {label}
    </label>
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        {...register(name, rules)}
        className={`w-full p-3 bg-white border rounded-lg focus:ring-2 outline-none pr-10 transition-colors ${
          error ? "border-red-500 focus:ring-red-400/20" : "border-gray-200 focus:ring-[#D7CD43]/50 focus:border-[#D7CD43]"
        }`}
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D7CD43] transition-colors"
      >
        {visible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
      </button>
    </div>
    {error && <p className="text-red-500 text-[10px] font-bold ml-1 uppercase">{error}</p>}
  </div>
);

export default Login;