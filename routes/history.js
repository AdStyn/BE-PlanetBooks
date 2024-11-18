var express = require("express");
var router = express.Router();
const models = require("../models");
const historie = require("../models/historie");
const jwtverify = require("../middleware/authMiddleware");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Hanya file gambar yang diperbolehkan!"));
    }
  },
});

router.post("/transaksi", jwtverify, async (req, res, next) => {
  try {
    const { id_user, image, judulbuku, author, kategori, harga } = req.body;
    const Iduser = req.userId;
    const transaction = await models.historie.create({
      id_user: Iduser,
      image,
      judulbuku,
      author,
      kategori,
      harga,
    });
    if (!cekdata) {
      return res.status(401).json({ responseCode: 401, message: "errorr" });
    }
    if (cekdata.img) {
      cekdata.img = "uploads/" + cekdata.img;
    }
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
