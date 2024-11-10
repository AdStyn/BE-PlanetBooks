"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tabel_user extends Model {
    static associate(models) {}
  }
  tabel_user.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "tabel_user",
    }
  );
  return tabel_user;
};
