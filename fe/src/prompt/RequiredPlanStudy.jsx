import PropTypes from "prop-types";

const RequiredPlanStudy = ({ darkMode }) => {
  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${
        darkMode ? "bg-slate-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* Tiêu đề chính */}
      <h1 className="text-5xl font-bold text-center mb-6 uppercase">
        Kế hoạch học tập
      </h1>

      {/* Nội dung yêu cầu */}
      <div className="w-full max-w-3xl px-4 text-center">
        <h1 className="text-3xl font-bold mb-4 border-b pb-2">
          Yêu cầu kế hoạch học tập
        </h1>
        <p className="text-lg mb-10">
          "Dựa trên kiến thức cơ bản của tôi về (Khóa học bạn sẽ chọn), xin vui
          lòng đưa ra một kế hoạch học tập chi tiết để tôi có thể tiếp tục học
          và nâng cao kỹ năng của mình. Kế hoạch học tập nên bao gồm các bước
          học cụ thể, các tài nguyên cần thiết, và các mục tiêu cần đạt được
          trong từng giai đoạn."
        </p>

        {/* Các mục chi tiết */}
        <h2 className="text-2xl font-semibold mt-4 mb-2 border-b pb-2">
          Mục tiêu
        </h2>
        <p className="mb-4">Đưa ra kế hoạch học tập chi tiết.</p>

        <h2 className="text-2xl font-semibold mt-4 mb-2 border-b pb-2">
          Ngữ cảnh
        </h2>
        <p className="mb-4">
          Người dùng đã có kiến thức cơ bản về (Khóa học bạn sẽ chọn).
        </p>

        <h2 className="text-2xl font-semibold mt-4 mb-2 border-b pb-2">
          Yêu cầu cụ thể
        </h2>
        <p className="mb-4">Cung cấp kế hoạch học tập chi tiết.</p>

        <h2 className="text-2xl font-semibold mt-4 mb-2 border-b pb-2">
          Yêu cầu chi tiết
        </h2>
        <p className="mb-10">
          Bao gồm các bước học, tài nguyên và mục tiêu giai đoạn.
        </p>

        {/* Lưu ý khi viết prompt */}
        <h1 className="text-3xl font-bold mb-4 border-b pb-2">
          Một số lưu ý khi viết prompt
        </h1>
        <ul className="list-disc list-inside text-left mb-4">
          <li>
            Cụ thể và rõ ràng: Càng chi tiết về yêu cầu và ngữ cảnh, AI càng dễ
            hiểu và đưa ra kết quả chính xác.
          </li>
          <li>
            Tránh mơ hồ: Tránh sử dụng các từ ngữ quá chung chung hoặc không rõ
            ràng.
          </li>
          <li>
            Tạo câu hỏi mở nếu cần: Để AI có thể cung cấp nhiều thông tin hoặc
            các lựa chọn khác nhau.
          </li>
          <li>
            Kiểm soát phạm vi: Đảm bảo rằng yêu cầu không quá rộng, nếu không AI
            sẽ khó có thể cung cấp thông tin chính xác.
          </li>
        </ul>

        <p className="text-lg">
          <b>$(Khóa học bạn sẽ chọn)</b>: Đại diện cho lĩnh vực mà bạn đang muốn
          học hoặc tìm hiểu. Ví dụ: "lập trình Python", "phát triển web", "học
          máy (Machine Learning)", "phân tích dữ liệu", hoặc bất kỳ chủ đề nào
          khác mà bạn quan tâm.
        </p>
        <p className="text-lg mt-4">
          (Chủ đề ): Đại diện cho một chủ đề cụ thể hoặc khái niệm nhỏ hơn trong
          lĩnh vực (Khóa học bạn sẽ chọn). Ví dụ: nếu (Khóa học bạn sẽ chọn) là
          "phát triển web", thì (Chủ đề ) có thể là "React.js", "CSS Grid", hoặc
          "RESTful API".
        </p>
      </div>
    </div>
  );
};
RequiredPlanStudy.propTypes = {
  darkMode: PropTypes.bool.isRequired,
};
export default RequiredPlanStudy;
