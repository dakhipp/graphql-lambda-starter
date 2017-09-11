module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Books',
      'UserId',
      {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        allowNull: false,
        defaultValue: 1,
        references: {
          model: 'Users',
          key: 'id'
        }
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Books', 'UserId');
  }
};
