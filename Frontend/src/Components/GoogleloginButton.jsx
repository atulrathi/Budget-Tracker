import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <GoogleLogin
      onSuccess={async (res) => {
        try {
          const token = res.credential;

          const response = await axios.post(
            "https://budget-xi-liart.vercel.app/auth/google",
            { token }
          );

          if (response.status === 200) {
            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("Google login error:", error);
        }
      }}
      onError={() => console.log("Login Failed")}
    />
  );
}

export default Login;
