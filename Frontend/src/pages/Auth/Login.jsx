import React from "react";
import GoogleLoginbutton from "../../Components/GoogleloginButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios"

const Login = () => {

  const [username, setusername] = useState("");
  const [password, setpassword] = useState("")

  const Nevigate = useNavigate();

  const login = async()=>{
    try{
      const user = await axios.post("http://localhost:5000/auth/login",{
        username,
        password,
      });
      localStorage.setItem("token",user.jwtToken)
      Nevigate("/dashboard");
    }catch(e){
      console.log(e.message)
    }
  }

  const registerpage = ()=>{
    Nevigate("/register")
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* Top Header */}
        <div className="bg-gradient-to-br from-yellow-700 via-purple-300 to-orange-900 px-6 py-6 text-center">
          <h2 className="text-xl font-semibold text-white">
            Secure account access
          </h2>
          <p className="text-white/80 text-sm mt-1">
            Log in to continue to your dashboard
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6">

          {/* Email */}
          <input
            type="text"
            onChange={(e)=>{setusername(e.target.value)}}
            placeholder="Username"
            className="w-full mb-3 px-4 py-3 text-sm bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Password */}
          <input
            type="password"
            onChange={(e)=>{(setpassword(e.target.value))}}
            placeholder="Password"
            className="w-full mb-4 px-4 py-3 text-sm bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Login Button */}
          <button 
          onClick={()=>{
            login();
          }}
          className="w-full bg-black hover:bg-slate-900 text-white py-3 rounded-xl text-sm font-semibold transition">
            Log in
          </button>

          {/* Forgot password */}
          <p className="text-xs text-slate-500 text-center mt-4">
            Forgot your password?
            <span className="text-indigo-600 font-medium hover:underline cursor-pointer">
              {" "}Reset it
            </span>
          </p>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="mx-3 text-xs text-slate-400">
              or continue with
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Google Login at Bottom */}
          <GoogleLoginbutton />

          {/* Footer */}
          <p className="text-xs text-slate-500 text-center mt-6">
            New here?
            <span 
            onClick={()=>{
              registerpage();
            }}
            className="text-indigo-600 font-medium hover:underline cursor-pointer">
              {" "}Create an account
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;
