import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleLoginbutton from "../../Components/GoogleloginButton";
import axios from "axios";

const Register = () => {
  const Navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fullname, setfullname] = useState("");
  const [username, setusername] = useState("");

  const loginpage = () => {
    Navigate("/");
  };

  // 🔐 Password validation logic
  const handleRegister = async () => {
    // Regex:
    // (?=.*[A-Z]) → at least one capital letter
    // (?=.*[@$!%*?&]) → at least one special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*[@$!%*?&])/;

    if (!passwordRegex.test(password)) {
      setError(
        "Password must include at least one capital letter and one special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }

try {
  const user = await axios.post(
    "http://localhost:5000/auth/register",
    { fullname, username, password }
  );

  if (user.status === 201) {
    Navigate("/");
  }
} catch (err) {
  setError(err.response?.data?.message || "Something went wrong");
}


    // If everything is valid
    setError("");
    alert("Account created successfully!");
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-200 px-3">
      <div className="w-full max-w-[330px] sm:max-w-[380px] md:max-w-[420px] rounded-3xl shadow-xl bg-white overflow-hidden">
        {/* Header */}
        <div className="h-32 flex items-center justify-center text-white text-lg font-semibold bg-gradient-to-br from-orange-400 via-rose-400 to-emerald-400">
          Create an account
        </div>

        {/* Content */}
        <div className="px-5 py-5 space-y-2">
          <input
            type="text"
            placeholder="Full name"
            onChange={(e) => {
              setfullname(e.target.value);
            }}
            className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
          />

          <input
            type="text"
            placeholder="User Name"
            onChange={(e) => {
              setusername(e.target.value);
            }}
            className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
          />

          <input
            type="password"
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
          />

          {/* Error message */}
          {error && (
            <p className="text-[11px] text-red-500 text-center">{error}</p>
          )}

          <button
            onClick={handleRegister}
            className="w-full mt-3 bg-black text-white rounded-full py-2.5 text-sm font-medium hover:bg-gray-900 transition"
          >
            Create account
          </button>

          {/* Divider */}
          <div className="flex items-center">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="px-2 text-[10px] text-gray-400">or</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          <GoogleLoginbutton />

          <p className="text-[11px] text-center text-gray-600">
            Have an account?{" "}
            <span
              onClick={loginpage}
              className="font-medium underline cursor-pointer"
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
