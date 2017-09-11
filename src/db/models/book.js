module.exports = function book(sequelize, DataTypes) {
  const Book = sequelize.define('Book', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
  });

  Book.associate = (models) => {
    Book.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Book;
};
