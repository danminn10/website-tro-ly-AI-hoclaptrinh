// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{html,js,jsx,ts,tsx}", // Chỉnh sửa đường dẫn nếu cần
];

export const theme = {
  extend: {
    keyframes: {
      typing: {
        "0%": {
          width: "0%",
          visibility: "hidden",
        },
        "100%": {
          width: "100%",
          visibility: "visible", // Chắc chắn rằng chữ sẽ hiển thị sau khi gõ xong
        },
      },
      blink: {
        "50%": {
          borderColor: "transparent",
        },
        "100%": {
          borderColor: "white",
        },
      },
    },
    animation: {
      typing: "typing 2s steps(20) 1s forwards, blink 0.7s infinite", // Sử dụng bước `steps(20)` cho 20 ký tự
    },
  },
};

export const darkMode = "class";  // Bật dark mode bằng cách sử dụng lớp "dark"
export const plugins = [];
