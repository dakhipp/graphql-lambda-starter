'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Books',
      'content',
      {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Books', 'content');
  }
};
