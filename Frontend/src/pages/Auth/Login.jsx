import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Sparkles, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";
import GoogleLoginbutton from "../../Components/GoogleloginButton";
const api = "https://budget-tracker-ruby.vercel.app";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async () => {
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const response = await axios.post(`${api}/auth/login`, {
        username,
        password,
      });
      
      localStorage.setItem("token", response.data.jwtToken);
      navigate("/dashboard");
    } catch (e) {
      setError(e.response?.data?.message || "Login failed. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      login();
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 px-4">
      <div className="w-full max-w-md">
        
        {/* Logo Section */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg mb-3">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-sm">Sign in to SpendWise</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="p-6">
            
            {/* Error Message */}
            {error && (
              <div className="mb-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="text-xs font-medium">{error}</p>
              </div>
            )}

            {/* Username Input */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right mb-4">
              <button className="text-xs text-purple-600 hover:text-purple-700 font-semibold transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              onClick={login}
              disabled={loading || !username || !password}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-3 text-xs text-gray-500 font-medium">or</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Google Login */}
            <GoogleLoginbutton />

            {/* Sign Up Link */}
            <p className="text-center text-xs text-gray-600 mt-4">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
              >
                Create one
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;