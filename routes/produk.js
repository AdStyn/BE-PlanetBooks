var express = require("express");
var router = express.Router();
const multer = require("multer");
const path = require("path");
const ProdukBuku = require("../models/produkbuku");
const KategoriBuku = require("../models/kategoribuku");
const models = require("../models");

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

/* tambah produk */
router.post(
  "/insertproduk",
  upload.single("image"),
  async function (req, res, next) {
    console.log(req.body);
    try {
      const { judul, author, harga, kategoriId } = req.body;
      const insertProduk = {
        judul,
        author,
        harga,
        kategoriId,
      };
      if (req.file) {
        insertProduk.image = req.file.filename;
      }
      const Insertproduk = await models.ProdukBuku.create(insertProduk);
      res.json("Produk Berhasil Ditambahkan");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

/*update produk*/
router.put(
  "/update/produk",
  upload.single("image"),
  async function (req, res, next) {
    console.log(req.body);
    try {
      // Mendapatkan ID dari query parameter
      const id = req.query.id;

      // Validasi ID
      if (!id) {
        return res.status(400).json({ error: "ID produk tidak boleh kosong" });
      }

      // Validasi input
      const { author, judul, harga, kategoriId } = req.body;
      if (!author || !judul || !harga || !kategoriId) {
        return res.status(400).json({ error: "Semua field harus diisi" });
      }

      // Siapkan data untuk diupdate
      const updatedProduk = {
        author,
        judul,
        harga: parseFloat(harga), // Pastikan harga adalah angka
        kategoriId,
      };

      // Jika ada file gambar yang di-upload, tambahkan path-nya ke update
      if (req.file) {
        updatedProduk.image = req.file.filename;
      }

      // Melakukan update
      const [updatedRowCount] = await models.ProdukBuku.update(updatedProduk, {
        where: { id: id },
      });

      // Memeriksa apakah produk ditemukan dan diperbarui
      if (updatedRowCount === 0) {
        return res.status(404).json({ error: "Produk tidak ditemukan" });
      }

      // Mengembalikan respons yang lebih informatif
      res.status(200).json({
        message: "Update Success",
        updatedProduk: { id, ...updatedProduk }, // Kembalikan data yang diperbarui
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ responseCode: 500, message: "Terjadi kesalahan pada server" });
    }
  }
);

//=============================================================================================================//
//============================ TAMPILAN PRODUK ==============================//
//=============================================================================================================//

module.exports = router;
