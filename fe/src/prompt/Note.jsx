import PropTypes from "prop-types";
import React from "react";

const Note = ({ darkMode }) => {
  return (
    <div
      className="flex flex-col items-center w-full"
      style={{ paddingTop: "100px" }}
    >
      {/* Main Title */}
      <h1 className="text-4xl font-bold text-center">Document</h1>
      <p className="text-lg text-gray-500 text-center">Please read carefully</p>

      {/* Horizontal Line */}
      <hr className="border-t-2 border-gray-400 w-3/4 my-6" />

      {/* Placeholder for additional content */}
      <div
        className={`text-lg ${
          darkMode ? "text-white" : "text-gray-700"
        } text-center`}
      >
        <h2 className="text-2xl font-semibold mb-4">
          Cách Viết Prompt Hiệu Quả Khi Tương Tác Với AI
        </h2>
        <p>
          Viết prompt hiệu quả khi tương tác với AI có thể cải thiện đáng kể độ
          rõ ràng và chính xác trong câu trả lời mà bạn nhận được. Hãy tuân theo
          công thức dưới đây để tạo một prompt rõ ràng và chặt chẽ:
        </p>
        <ol className="list-decimal list-inside mt-4 space-y-4 pl-8">
          {[
            "Xác định mục tiêu hoặc yêu cầu: Mô tả rõ ràng điều bạn muốn AI thực hiện, chẳng hạn như cung cấp thông tin, gợi ý, giải thích một vấn đề, lập kế hoạch, hoặc phân tích.",
            "Cung cấp ngữ cảnh (nếu cần): Đưa ra thông tin về bối cảnh liên quan, chẳng hạn như bạn đã có kiến thức cơ bản hay đang bắt đầu tìm hiểu về một lĩnh vực nào đó.",
            "Chỉ định các chi tiết quan trọng: Đưa vào các yếu tố cụ thể mà AI cần cân nhắc, ví dụ như chủ đề, cấp độ kiến thức, mục tiêu, hoặc bất kỳ yêu cầu đặc biệt nào.",
            "Yêu cầu kết quả cụ thể: Nêu rõ loại đầu ra bạn mong đợi, chẳng hạn như tóm tắt, danh sách các bước, ví dụ cụ thể, hoặc giải thích chi tiết.",
            "Xác định mức độ chi tiết hoặc phạm vi: Yêu cầu AI trả lời ngắn gọn hay chi tiết đầy đủ (ví dụ: 'tóm tắt ngắn', 'giải thích toàn diện', hoặc 'liệt kê các ý chính').",
          ].map((item, index) => (
            <li
              key={index}
              className="flex items-start space-x-2 leading-relaxed text-justify"
            >
              <span className="font-semibold">{index + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-4xl font-bold">
          Bằng cách tuân thủ cấu trúc này, bạn có thể truyền đạt yêu cầu của
          mình một cách rõ ràng và đạt được câu trả lời chất lượng cao từ AI.
        </p>
      </div>
    </div>
  );
};
Note.propTypes = {
  darkMode: PropTypes.bool.isRequired,
};
export default Note;
