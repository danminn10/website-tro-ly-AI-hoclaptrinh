import PropTypes from "prop-types";
import React from "react";

const RequiredInforAboutCourse = ({ darkMode }) => {
  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start ${
        darkMode ? "bg-slate-900 text-white" : "bg-white text-gray-800"
      }`}
      style={{ paddingTop: "100px" }}
    >
      {/* Tiêu đề lớn */}
      <h1 className="text-4xl font-bold text-center mb-6 uppercase">
        Hướng dẫn
      </h1>
      <p className="text-xl text-center mb-10">
        Hướng dẫn cách sử dụng prompt để yêu cầu chính xác
      </p>
      <h1 className="text-2xl font-bold mb-4 border-b pb-2">
        Yêu cầu thông tin về khóa học
      </h1>
      <p className="mb-6">
        "Xin vui lòng cung cấp thông tin chi tiết về khóa học (Khóa học mà bạn
        mong muốn). Tôi muốn biết về các nội dung học, mức độ khó, thời gian
        học, các bài tập thực hành, và các kỹ năng tôi sẽ học được khi tham gia
        khóa học này. Ngoài ra, nếu có các khóa học phù hợp với cấp độ người mới
        bắt đầu hoặc nâng cao trong (Khóa học mà bạn mong muốn), xin vui lòng
        liệt kê các khóa học đó."
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2 border-b pb-2">
        Mục tiêu
      </h2>
      <p className="mb-4">Cung cấp thông tin về khóa học.</p>

      <h2 className="text-xl font-semibold mt-4 mb-2 border-b pb-2">
        Ngữ cảnh
      </h2>
      <p className="mb-4">Người dùng muốn biết chi tiết về khóa học.</p>

      <h2 className="text-xl font-semibold mt-4 mb-2 border-b pb-2">
        Yêu cầu cụ thể
      </h2>
      <p className="mb-4">
        Cung cấp thông tin về nội dung, mức độ khó, thời gian, bài tập thực
        hành.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2 border-b pb-2">
        Yêu cầu chi tiết
      </h2>
      <p>Liệt kê các khóa học phù hợp với cấp độ người học.</p>
    </div>
  );
};
RequiredInforAboutCourse.propTypes = {
  darkMode: PropTypes.bool.isRequired,
};
export default RequiredInforAboutCourse;
