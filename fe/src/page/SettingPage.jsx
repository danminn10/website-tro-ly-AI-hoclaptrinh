import React, { useState } from "react";
import { fetchUpdateUser } from "../services/UserServices";

const SettingPage = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetchUpdateUser(formData); // Gọi API
      setMessage(response.message); // Thông báo thành công
      setError(""); // Xóa lỗi nếu thành công
    } catch (err) {
      setError(err.message || "Cập nhật thất bại"); // Hiển thị lỗi
      setMessage(""); // Xóa thông báo thành công
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Cập Nhật Người Dùng
        </h1>

        {/* Hiển thị thông báo */}
        {message && (
          <p className="text-green-500 text-center mb-4">{message}</p>
        )}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Fullname */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Tên đầy đủ
            </label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Nhập tên đầy đủ"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Nhập email"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Nhập mật khẩu mới (nếu có)"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cập Nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingPage;
