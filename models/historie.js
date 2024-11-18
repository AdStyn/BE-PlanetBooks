"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  History.init(
    {
      id_user: DataTypes.INTEGER,
      image: DataTypes.STRING,
      judulbuku: DataTypes.STRING,
      author: DataTypes.STRING,
      kategori: DataTypes.STRING,
      harga: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Historie",
    }
  );
  return History;
};
