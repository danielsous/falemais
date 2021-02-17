'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('plan', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      plan: {
        type: Sequelize.STRING
      },
      minutes: {
        type: Sequelize.NUMERIC
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('plan')
  }
}
