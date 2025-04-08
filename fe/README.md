<<<<<<< HEAD
# UDHocLTThongMinh
Chạy server: 
Cài npm install
Chỉnh lại file cấu hình trong folder: config 
Vào mysql tạo csdl: Create database UDHLTTM;
Vào cloudinary.js chỉnh lại phần này 
cloudinary.config({
  cloud_name: 'diudnwgbf',
  api_key: '284361171674877',
  api_secret: 'Hw7Rybnz8Z_Yz-ARtHRZLXZYmg4'
});
Vào https://cloudinary.com chọn sign up for free đăng nhập vào nó hỏi 
What's your main interest?
Chọn  coding with api and sdks chọn let start
Vào profile góc trái dưới chọn api key vào tạo apikey và coppy api secret chọn icon thứ hai ở cột trái chọn dashboard để coppy cloud name
Tiếp theo vào file Database.js chỉnh lại password ví dụ máy tui là ‘081004’ đổi lại mật khẩu đặt lúc nào mysql
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
  'UDHLTTM',    // DB_NAME
  'root',        // DB_USER
  '081004',      // DB_PASSWORD
  {
    host: 'localhost',  // DB_HOST
    dialect: 'mysql',   // DB_DIALECT (hoặc 'mysql2' nếu bạn sử dụng mysql2)
    logging: console.log
  }
);
Chạy backend: node App.js
Test backend: 
-	chức năng đăng ký:
POST: http://localhost:3000/auth/register
Phần body: chọn raw: 
{
  "fullname": "Nguyễn Quốc Khanh",
  "email": "quockhanha2@gmail.com",
  "password": "123456789",
  "role": "user"
}
-	Đăng nhập:
POST: http://localhost:3000/auth/login
Tương tự đăng ký: 
{
  "email": "quockhanha2@gmail.com",
  "password": "123456789"
}
-	Thêm video: 
POST:  http://localhost:3000/videos
Phần body chọn form-data bên góc phải trên chọn Bulk Edit
Dán phần bên dưới vào 
title:Functions in JavaScript  JavaScript Tutorial in Hindi
description:In this video, we will learn about Functions in JavaScript. A function is a block of code designed to perform a particular task. It helps in organizing and reusing code efficiently. In JavaScript, you can declare a function using the function keyword, followed by a name, parameters (optional), and a block of code. Functions allow you to break down complex tasks into smaller, manageable pieces of code. We’ll cover function syntax, how to call functions, and the different types of functions, including regular functions, anonymous functions, and arrow functions.↵↵This tutorial is in Hindi, so it’s easier for Hindi-speaking viewers to understand the concept of functions in JavaScript. Let's dive in!
category:JavaScript
courseId:1
sau khi dán thì cũn góc đó chọn key-value edit
thêm một dòng url và ngay cột Text có mũi tên xuống chọn lại định dạng là file sau đó chọn file video trong máy mình.
-	Chỉnh sữa thông tin video theo id;
PUT: http://localhost:3000/videos/1 số 1 là id của video trong csdl 
Vào Body chọn raw rồi past thông tin cần chỉnh sữa vào;
{
  "title": "Cách sử dụng JS trong file HTML  Visual Studio Code",
  "description": "Để sử dụng JavaScript trong file HTML trên Visual Studio Code, bạn chỉ cần tạo một file .html và thêm một đoạn mã JavaScript bên trong thẻ <script>. Bạn có thể viết mã JavaScript trực tiếp trong file HTML hoặc tham chiếu đến một file .js riêng biệt. Khi làm việc với Visual Studio Code, bạn sẽ được hỗ trợ các tính năng như tự động hoàn thành mã, kiểm tra lỗi, và dễ dàng xem kết quả ngay trên trình duyệt. Trong video này, bạn sẽ học cách tích hợp JavaScript vào file HTML, sử dụng các công cụ của Visual Studio Code để làm việc hiệu quả hơn và kiểm tra mã nhanh chóng.",
  "category": "JavaScript"
}
ở đây cần chỉnh 3 thông tin thì past 3 cái nếu sữa nhiều hơn thì past  vào 
xóa video thì chỉ cần chọn phương thức
DELETE: http://localhost:3000/videos/4  số 4 là id video cần xóa 
-	Chức năng tìm video theo danh mục 
GET: http://localhost:3000/videos/category/JavaScript
JavaScript là danh mục nếu tìm theo java or python thì thay vào chổ này 
-	Chức năng thêm courses:
POST: http://localhost:3000/courses
Vào body chọn form-data: chọn Bulk edit ở góc phải trên của form-data 
Dán phần này vào:
title:Javascript cơ bản 1
description:Làm quen với vscode và các toán tử cơ bản trong , javascript và một số hàm builtin , cách comment
price:0
discount:0
time:5
level:2
status:active

thêm 1 dòng key image value chỉnh lại định dạng file rồi thêm ảnh ở máy vào 
-	Chỉnh sữa thông tin khóa học:
PUT: http://localhost:3000/courses/1
Vào form-data làm tương tự như thêm nhưng phải đúng id để tránh sữa lộn 
-	Xóa khóa học theo Id
DELETE: http://localhost:3000/courses/2
-	Lấy khóa học theo Id
GET: http://localhost:3000/courses/1
-	Lấy full khóa học 
GET: http://localhost:3000/courses/all
-	 Tìm kiếm khóa học theo title or level or tìm theo cả hai 
GET: http://localhost:3000/courses/search?title=Javascript
Vào Params :
Thêm Key và value của title và level vào tìm theo cái nào thì tích vào ô bên trái của key 
Tìm theo cả 2 thì tick hết 
-	Tính năng chat với AI:
Vào body chọn raw: past bên dưới vào 
{
  "userId": 1,
  "message": "lộ trình học java"
}
-	Chức năng AI phản hồi bằng âm thanh 
POST: http://localhost:3000/conversations/v1/text-to-speech
{
    "userId": 3,
    "text": "Lộ trình học java trong 7 ngày?"
}
-	cũng tương tự nhưng chat 





=======
<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
=======
# UDHocLTThongMinh
>>>>>>> 1b158b8074b5d1969d55ada7de2b0fdd54ba0be5
>>>>>>> 0279e9f304f99dc8a2561c8472b97c6aaa1aad56
