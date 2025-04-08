import PropTypes from "prop-types";

const RequiredProjectSuggest = ({ darkMode }) => {
  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${
        darkMode ? "bg-slate-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* Tiêu đề chính */}
      <h1 className="text-5xl font-bold text-center mb-6 uppercase">
        Yêu cầu gợi ý dự án
      </h1>

      {/* Nội dung yêu cầu */}
      <div className="w-full max-w-3xl px-4 text-center">
        <p className="text-lg mb-10">
          "Tôi đã hoàn thành khóa học về (Khóa học bạn sẽ chọn ), và bây giờ tôi
          muốn biết những dự án thực tế nào tôi nên thực hiện để củng cố và nâng
          cao kiến thức đã học. Tôi muốn những dự án này giúp tôi áp dụng lý
          thuyết vào thực tế, giải quyết các vấn đề cụ thể, và phát triển kỹ
          năng lập trình của mình trong (Khóa học bạn sẽ chọn ). Nếu có những dự
          án nâng cao, xin vui lòng liệt kê các dự án đó và mức độ khó của mỗi
          dự án."
        </p>

        {/* Các mục chi tiết */}
        <h2 className="text-2xl font-semibold mt-4 mb-2 border-b pb-2">
          Mục tiêu
        </h2>
        <p className="mb-4">Gợi ý dự án để củng cố và nâng cao kiến thức.</p>

        <h2 className="text-2xl font-semibold mt-4 mb-2 border-b pb-2">
          Ngữ cảnh
        </h2>
        <p className="mb-4">Người dùng đã hoàn thành khóa học.</p>

        <h2 className="text-2xl font-semibold mt-4 mb-2 border-b pb-2">
          Yêu cầu cụ thể
        </h2>
        <p className="mb-4">Gợi ý các dự án thực tế.</p>

        <h2 className="text-2xl font-semibold mt-4 mb-2 border-b pb-2">
          Yêu cầu chi tiết
        </h2>
        <p>Liệt kê các dự án, mức độ khó của mỗi dự án.</p>
      </div>
    </div>
  );
};
RequiredProjectSuggest.propTypes = {
  darkMode: PropTypes.bool.isRequired,
};
export default RequiredProjectSuggest;
