import PropTypes from "prop-types";

const IntroductionAI = ({ darkMode }) => {
  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${
        darkMode ? "bg-slate-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      <div className="text-center px-4 max-w-2xl">
        <h1 className="text-4xl font-bold uppercase tracking-wide mb-4">
          Introduction AI
        </h1>
        <h2 className="text-3xl font-semibold text-indigo-500 mb-6">LLAMA 3</h2>
        <h1 className="text-3xl font-bold mb-4">Giới thiệu về LLaMA 3</h1>
        <p className="mb-4">
          LLaMA 3 (Large Language Model Meta AI) là thế hệ mới nhất của mô hình
          xử lý ngôn ngữ tự nhiên (NLP) do Meta AI phát triển. Đây là một bước
          tiến vượt bậc trong lĩnh vực trí tuệ nhân tạo, mang lại hiệu suất cao
          và khả năng ứng dụng đa dạng.
        </p>
        <h2 className="text-2xl font-bold mb-2">Các tính năng nổi bật</h2>
        <ul className="list-disc list-inside mb-4">
          <li>
            Hiệu suất tối ưu trong các nhiệm vụ NLP như tạo văn bản, dịch ngôn
            ngữ.
          </li>
          <li>
            Khả năng tóm tắt, phân tích cảm xúc, trả lời câu hỏi chính xác.
          </li>
          <li>Hỗ trợ viết mã và xử lý ngôn ngữ chuyên sâu.</li>
        </ul>
        <h2 className="text-2xl font-bold mb-2">Lợi ích của LLaMA 3</h2>
        <p>
          LLaMA 3 được thiết kế để hỗ trợ các nhà nghiên cứu và lập trình viên
          dễ dàng tiếp cận với công nghệ tiên tiến, giúp tăng cường hiệu quả
          trong các lĩnh vực như giáo dục, kinh doanh, và nghiên cứu khoa học.
        </p>
      </div>
    </div>
  );
};

IntroductionAI.propTypes = {
  darkMode: PropTypes.bool.isRequired,
};

export default IntroductionAI;
