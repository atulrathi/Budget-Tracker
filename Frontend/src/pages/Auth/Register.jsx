import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Sparkles, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff, UserPlus } from "lucide-react";
import GoogleLoginbutton from "../../Components/GoogleloginButton";

const Register = () => {
  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validation
    if (!fullname || !username || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[@$!%*?&])/;
    if (!passwordRegex.test(password)) {
      setError("Password must have 1 capital & 1 special character");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post("https://budget-tracker-s0vs.onrender.com/auth/register", {
        fullname,
        username,
        password,
      });

      if (response.status === 201) {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 px-4 py-4 overflow-auto">
      <div className="w-full max-w-md my-auto">
        
        {/* Logo Section */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg mb-2">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1">
            Create Account
          </h1>
          <p className="text-gray-600 text-xs">Join SpendWise today</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="p-5">
            
            {/* Error Message */}
            {error && (
              <div className="mb-3 flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <p className="text-xs font-medium">{error}</p>
              </div>
            )}

            {/* Full Name Input */}
            <div className="mb-2.5">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserPlus className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your full name"
                  className="w-full pl-8 pr-2.5 py-2 text-xs bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Username Input */}
            <div className="mb-2.5">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Choose a username"
                  className="w-full pl-8 pr-2.5 py-2 text-xs bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-2.5">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Create a password"
                  className="w-full pl-8 pr-8 py-2 text-xs bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="mb-2.5">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Confirm your password"
                  className="w-full pl-8 pr-8 py-2 text-xs bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-[10px] text-blue-800 leading-relaxed">
                Must have 1 capital letter & 1 special character
              </p>
            </div>

            {/* Register Button */}
            <button
              onClick={handleRegister}
              disabled={loading || !fullname || !username || !password || !confirmPassword}
              className="w-full flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs"
            >
              {loading ? (
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center my-3">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-2 text-[10px] text-gray-500 font-medium">or</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Google Login */}
            <GoogleLoginbutton />

            {/* Login Link */}
            <p className="text-center text-[10px] text-gray-600 mt-3">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/")}
                className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;