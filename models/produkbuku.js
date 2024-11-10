"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProdukBuku extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProdukBuku.belongsTo(models.KategoriBuku, {
        foreignKey: "kategoriId",
        as: "KategoriBuku",
      });
    }
  }
  ProdukBuku.init(
    {
      image: DataTypes.STRING,
      judul: DataTypes.STRING,
      author: DataTypes.STRING,
      harga: DataTypes.INTEGER,
      kategoriId: {
        type: DataTypes.INTEGER,
        references: {
          model: "KategoriBuku", // Menghubungkan ke model Kategori
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "ProdukBuku",
    }
  );
  return ProdukBuku;
};
