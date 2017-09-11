module.exports = function user(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    scope: DataTypes.STRING
  });

  User.associate = (models) => {
    User.hasMany(models.Book);
  };

  return User;
};
