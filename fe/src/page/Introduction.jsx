import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

const Introduction = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/register");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-tr from-green-400 via-blue-500 to-purple-600 p-6">
      <div className="absolute top-6 right-6 flex gap-4">
        <button
          onClick={handleStart}
          className="px-6 py-2 bg-blue-500 rounded-xl text-white text-lg font-semibold shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500"
        >
          Đăng ký
        </button>
        <button
          onClick={handleLogin}
          className="px-6 py-2 bg-green-500 rounded-xl text-white text-lg font-semibold shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-500"
        >
          Đăng nhập
        </button>
      </div>

      <div className="w-full max-w-lg text-center px-4">
        <div className="mb-8">
          <img
            src={logo}
            alt="Logo"
            className="w-24 h-24 mx-auto rounded-full shadow-lg"
          />
        </div>

        <h1 className="animate-typing overflow-hidden whitespace-nowrap border-r-4 border-white pr-5 text-3xl md:text-4xl text-white font-bold mb-4">
          Chào mừng đến với CodeAI
        </h1>

        <p className="text-lg text-white opacity-90 mb-4">
          Bạn muốn học lập trình nhưng không biết bắt đầu từ đâu? Để AI hỗ trợ
          bạn!
          <br />
          AI của chúng tôi sẽ đánh giá kỹ năng và tạo lộ trình học tập cá nhân
          hóa dành riêng cho bạn.
        </p>

        <p className="text-base opacity-80 mb-6">
          Hãy để chúng tôi đồng hành cùng bạn trong mỗi bước tiến, từ những bài
          học cơ bản đến nâng cao.
          <br />
          Chúng tôi điều chỉnh lộ trình học sao cho phù hợp với tốc độ học của
          bạn để đạt được kết quả tối ưu!
        </p>

        <button
          onClick={handleStart}
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-400 rounded-xl text-white text-lg font-semibold shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-500 mb-4"
        >
          Bắt đầu ngay
        </button>
      </div>
    </div>
  );
};

export default Introduction;
