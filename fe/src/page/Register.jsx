import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("user");
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async () => {
    try {
      await register(fullname, email, password, role);
      navigate("/login");
    } catch (err) {
      console.error("Đăng ký thất bại:", err.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-tr from-green-400 via-blue-500 to-purple-600 p-6">
      <div className="w-full max-w-lg text-center px-4">
        <h1 className="text-4xl text-white font-bold mb-6">
          Đăng ký tài khoản
        </h1>
        <input
          type="text"
          placeholder="Họ và tên"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />
        <button
          onClick={handleRegister}
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-400 rounded-xl text-white text-lg font-semibold"
        >
          Đăng ký
        </button>
      </div>
    </div>
  );
};

export default Register;
