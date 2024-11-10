const express = require("express");
const router = express.Router();
const models = require("../models/index");
const { Op, where } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const jwtverify = require("../middleware/authMiddleware");
const profil = require("../models/profil");

//digunakan untuk menambah image
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

/* Update setting*/
router.patch("/setting", jwtverify, async function (req, res, next) {
  try {
    const datasett = await models.profil.update(req.body, {
      where: {
        id: req.query.id,
      },
      attributes: ["image", "username", "email", "no_hp"],
    });
    if (!datasett) {
      return res.status(401).json({ responseCode: 401, message: "errorr" });
    }
    if (datasett.img) {
      datasett.img = "uploads/" + datasett.img;
    }
    datasett.save();
    return res.status(200).json({
      responseCode: 200,
      data: datasett,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
