const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
  'UDHLTTM',    // DB_NAME
  'root',        // DB_USER
  'cauvu1102pham',      // DB_PASSWORD
  {
    host: 'localhost',  // DB_HOST
    dialect: 'mysql',   // DB_DIALECT (hoặc 'mysql2' nếu bạn sử dụng mysql2)
    logging: console.log
  }
);

// Kiểm tra kết nối cơ sở dữ liệu
sequelize.authenticate()
  .then(() => {
    console.log('Kết nối cơ sở dữ liệu thành công.');

    // Đồng bộ tất cả các mô hình
    sequelize.sync({ alter: true }) // `force: true` sẽ tạo lại bảng, sử dụng cẩn thận ở môi trường sản xuất
    // alter: true sẽ thực hiện các thay đổi cần thiết để đồng bộ hóa mô hình với cơ sở dữ liệu
      .then(() => {
        console.log('Đồng bộ tất cả mô hình thành công!');
      })
      .catch((err) => {
        console.error('Lỗi khi đồng bộ mô hình:', err);
      });
  })
  .catch((err) => {
    console.error('Không thể kết nối cơ sở dữ liệu:', err);
  });

module.exports = sequelize;
