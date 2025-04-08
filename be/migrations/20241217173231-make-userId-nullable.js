'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Sửa đổi cột userId để cho phép null
    await queryInterface.changeColumn("Quizzs", "userId", {
      type: Sequelize.INTEGER,
      allowNull: true, // Cho phép null
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Khôi phục lại userId thành NOT NULL nếu rollback
    await queryInterface.changeColumn("Quizzs", "userId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
