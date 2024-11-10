var express = require("express");
var router = express.Router();
const multer = require("multer");
const path = require("path");
const KategoriBuku = require("../models/kategoribuku");

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

//tambah produk
router.post(
  "/insert/kategory",
  upload.single("image"),
  async function (req, res, next) {
    console.log(req.body);
    try {
      const { kategori } = req.body;
      const insertKategory = {
        kategori,
      };
      if (req.file) {
        insertKategory.image = req.file.filename;
      }
      const insertkategory = await models.KategoriBuku.create(insertKategory);
      res.json("Kategori Berhasil Ditambahan");
    } catch (error) {
      console.log(error);
    }
  }
);

/*update*/
router.put(
  "/update/kategory",
  upload.single("image"),
  async function (req, res, next) {
    try {
      const updateKategory = {
        kategori: req.body.kategori,
      };
      // Jika ada file gambar yang di-upload, tambahkan path-nya ke update
      if (req.file) {
        updateKategory.image = req.file.filename;
      }

      await models.KategoriBuku.update(updateKategory, {
        where: { id: req.query.id },
      });
      res.json("Update Success");
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ responseCode: 400, message: error.message });
    }
  }
);

router.get("/tampil_prdct/:kategoriId", async (req, res) => {
  try {
    const { kategoriId } = req.params;

    // Cari produk berdasarkan kategoriId
    const products = await models.Product.findAll({
      where: { kategoriId },
      include: [
        {
          model: models.kategori,
          attributes: ["title", "image"],
          as: "kategori",
        },
      ],
    });

    // Periksa apakah ada data produk yang ditemukan
    if (!products || products.length === 0) {
      return res.status(404).json({
        responseCode: 404,
        message: "Produk tidak ditemukan",
      });
    }

    // Modifikasi path gambar produk
    const productsWithImagePath = products.map((product) => {
      const productData = product.toJSON();
      if (productData.games && productData.games.image) {
        productData.games.image = `uploads/${productData.games.image}`;
      }
      return productData;
    });

    // Kirim respons JSON
    return res.status(200).json({
      responseCode: 200,
      data: productsWithImagePath,
    });
  } catch (error) {
    console.error("Error fetching products:", error); // Debugging log
    return res.status(500).json({
      responseCode: 500,
      message: "Terjadi kesalahan internal server",
      error: error.message, // Mengirim pesan error untuk debug
    });
  }
});

module.exports = router;
