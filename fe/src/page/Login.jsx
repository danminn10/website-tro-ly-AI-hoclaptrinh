import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { signin } = useAuth();

  const handleLogin = async () => {
    try {
      const user = await signin(email, password);

      if (user) {
        if (user.hasCompletedTest) {
          navigate("/home");
        } else {
          navigate("/start");
        }
      } else {
        console.error("Đăng nhập thành công nhưng không trả về user.");
      }
    } catch (error) {
      console.error("Đăng nhập thất bại:", error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-teal-400 to-blue-500 p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg"
        />
        <button
          onClick={handleLogin}
          className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
