import React, { useState } from "react";
import Layout from "../components/Layout";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import axiosInstance from "../axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ReCAPTCHA from "react-google-recaptcha";
import { Helmet } from 'react-helmet-async';

function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const { login } = useAuth(); // ✅ Auth context

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const errs = {};
    if (isSignUp && !/^[A-Za-z\s]+$/.test(formData.name)) errs.name = "Enter a valid name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Invalid email";
    if (formData.password.length < 6) errs.password = "Minimum 6 characters";
    if (isSignUp && formData.password !== formData.confirmPassword)
      errs.confirmPassword = "Passwords don't match";
    if (!recaptchaToken) errs.recaptcha = "Please verify you're not a robot.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/login";
    const payload = isSignUp
      ? { name: formData.name, email: formData.email, password: formData.password,recaptchaToken }
      : { email: formData.email, password: formData.password, recaptchaToken};

    try {
      const res = await axiosInstance.post(`http://localhost:5000${endpoint}`, payload);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      login(user); // ✅ Update auth context
      navigate(from); // ✅ Redirect only after login success
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleGoogleSignIn = () => {
    alert("Google Sign-In logic goes here (e.g., Firebase)");
  };

  return (
    <Layout>


      <Helmet>
        <title>{isSignUp ? "Sign Up - Kisite Canines" : "Login - Kisite Canines"}</title>
        <meta name="description" content="Login or sign up to book dog services at Kisite Canines." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-[#EAEAE8] px-4 py-20">

        <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-[#303A40] mb-4">
            {isSignUp ? "Create Account" : "Login to Your Account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-[#4F6866] mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:outline-none ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-[#4F6866] mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="relative">
              <label className="block text-[#4F6866] mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            {isSignUp && (
              <div>
                <label className="block text-[#4F6866] mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:outline-none ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      name="remember"
      checked={formData.remember}
      onChange={handleChange}
    />
    <label className="text-sm text-[#4F6866]">Remember Me</label>
  </div>

  {!isSignUp && (
    <button
      type="button"
      className="text-sm text-[#4F6866] hover:underline"
      onClick={() => alert("Forgot password flow coming soon")}
    >
      Forgot Password?
    </button>
  )}
</div>


            {/* ✅ reCAPTCHA */}
            <div>
              <ReCAPTCHA
                sitekey="6LdwWXwrAAAAAJaWDlSAbe1ZXbqen0XcOyGT5YAJ"
                onChange={(token) => setRecaptchaToken(token)}
              />
              {errors.recaptcha && (
                <p className="text-red-500 text-sm mt-1">{errors.recaptcha}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#D7CD43] text-[#303A40] py-2 rounded-md font-semibold hover:bg-[#C5BC39]"
            >
              {isSignUp ? "Sign Up" : "Login"}
            </button>
          </form>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300" />
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center gap-3 border border-gray-300 w-full py-2 rounded-md hover:bg-gray-100 transition"
          >
            <FcGoogle size={20} />
            <span className="text-sm font-medium text-[#303A40]">Continue with Google</span>
          </button>

          <p className="mt-4 text-center text-sm text-[#4F6866]">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              className="text-[#D7CD43] font-semibold hover:underline"
              onClick={() => setIsSignUp((prev) => !prev)}
            >
              {isSignUp ? "Login" : "Create one"}
            </button>
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Login;
