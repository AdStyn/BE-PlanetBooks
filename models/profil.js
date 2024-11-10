"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class profil extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  profil.init(
    {
      image: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      no_hp: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "profil",
    }
  );
  return profil;
};
