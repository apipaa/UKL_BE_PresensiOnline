'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'users', // Sesuaikan nama tabel dengan yang ada di database Anda
    //timestamps: false,  // Jika Anda tidak menggunakan `createdAt` dan `updatedAt`
  });

  return User;
};
