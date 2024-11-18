var express = require("express");
var router = express.Router();
const models = require("../models");
const historie = require("../models/historie");
const jwtverify = require("../middleware/authMiddleware");

router.post("/transaksi", jwtverify, async (req, res, next) => {
  try {
    const { id_user, judulbuku, kategori, harga } = req.body;
    const Iduser = req.userId;
    const transaction = await models.historie.create({
      id_user: Iduser,
      judulbuku,
      kategori,
      harga,
    });
    return res.status(201).json({ responseCode: 201, data: transaction });
  } catch (err) {
    return res.status(500).json({ responseCode: 500, message: "Error" });
  }
});

router.get("/histori", jwtverify, async (req, res) => {
  try {
    let histori = await models.historie.findAll({
      where: { id: req.userId },
      attributes: ["judulbuku", "kategori", " harga"],
    });

    return res.status(200).json({ responseCode: 200, data: histori });
  } catch (error) {
    return res.status(500).json({ responseCode: 500, message: "Error" });
  }
});

module.exports = router;
