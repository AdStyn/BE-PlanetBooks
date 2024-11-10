const express = require("express");
const router = express.Router();
const models = require("../models/index");
const { Op, where } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const jwtverify = require("../middleware/authMiddleware");

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

// User login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await models.profil.findOne({ where: { email } });
    console.log(user);
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const token = jwt.sign({ userId: user.id }, "ady-aiti", {});
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ responseCode: 400, message: error.message });
  }
});

//regristasi
router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userregis = await models.profil.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ responseCode: 400, message: error.message });
  }
});

//untuk menampilkan login ke profil
router.get("/showprofile", jwtverify, async function (req, res, next) {
  try {
    let cekdata = await models.profil.findOne({
      where: { id: req.userId },
      attributes: ["image", "username", "email"],
    });
    if (!cekdata) {
      return res.status(401).json({ responseCode: 401, message: "errorr" });
    }
    if (cekdata.img) {
      cekdata.img = "uploads/" + cekdata.img;
    }

    return res.status(200).json({
      responseCode: 200,
      data: cekdata,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
/*==========================================================================================*/
/* GET home page (tambah data) */
// router.post("/insert", async function (req, res, next) {
//   console.log(req.body);
//   try {
//     const insertdata = await models.tabel_user.create(req.body);
//     res.json("Data Berhasil Ditambahan");
//   } catch (error) {}
// });

/* findAll (Select Semua) menggunakan asyncronus */
// router.get("/get", jwtverify, async function (req, res, next) {
//   try {
//     let dataselect = await models.tabel_user.findAll({
//       // order: [['id','ASC']],
//       //req.query,
//       where: { id: { [Op.not]: req.userId } },
//     });
//     res.json(dataselect);
//   } catch (error) {
//     console.log(error);
//   }
//   console.log(req.query);
// });

/*Delete*/
// router.delete("/delete", async function (req, res, next) {
//   try {
//     const datadelete = await models.tabel_user.destroy({
//       where: {
//         id: req.query.id,
//       },
//     });
//     res.json("Data Berhasil Dihapus");
//   } catch (error) {
//     console.log(error);
//   }
// });

//tampil semua produk//

/*==========================================================================================*/
/* GET home page. 
router.post('/insert', function(req, res, next) {
  console.log(req.body);
    models.tabel_user
    .create(req.body)
    .then((status)=>res.send("Data Berhasil Ditambahkan"))
    .catch((err)=>console.log(err));
    order: [['id','ASC']],(urutan dari yang terkecil)
    order: [['id','DESC']],(urutan dari yang terbesar)

    order: [['id','ASC']],
        where: req.query,
        // {nama: {[Op.substring]: req.query.nama }},
  });*/

/* findAll (select semua) 
router.get('/get', function(req, res, next) {
  models.tabel_user
  .findAll()
  .then((result)=>res.json(result))
  .catch((err)=>console.log(err));
});*/

/* Update
router.patch('/post', function(req, res, next) {
  models.tabel_user
  .update(req.body, {
    where: {
      id: req.query.id,
    },
  })
  .then((result)=>res.json("Data Berhasil Diupdate"))
  .catch((err)=>console.log(err));
});*/

/* Detele 
router.delete('/delete', function(req, res, next) {
  models.tabel_user
  .destroy(req.body, {
    where: {
      id: req.body.id,
    },
  })
  .then((result)=>res.json(result))
  .catch((err)=>console.log(err));
});*/

//  const data = [
//   {
//     "id": 7,
//     "nama": "saya sendiri",
//     "tanggal_lahir": "2024-09-05T02:35:01.000Z",
//     "createdAt": "2024-09-05T07:16:10.000Z",
//     "updatedAt": "2024-09-05T07:16:10.000Z"
//   },
//   {
//     "id": 8,
//     "nama": "saya dwe",
//     "tanggal_lahir": "2024-09-05T02:35:01.000Z",
//     "createdAt": "2024-09-05T09:16:43.000Z",
//     "updatedAt": "2024-09-05-T09:16:43.000Z"
//   },
//   // ... data lainnya
// ];

// // Fungsi untuk mencari data berdasarkan ID
// function findDataById(data, id) {
//   return data.find(item => item.id === id);
// }

// // Menampilkan data dengan ID 7 dan 8
// const data7 = findDataById(data, 7);
// const data8 = findDataById(data, 8);

// console.log("Data dengan ID 7:");
// console.log(data7);

// console.log("Data dengan ID 8:");
// console.log(data8);

// router.patch('/post', async function (req, res, next) {
//   try {
//     // Update data
//     const [updatedRows, [updatedData]] = await models.tabel_user.update(req.body, {
//       where: {
//         id: req.query.id,
//       },
//       returning: true, // Mengembalikan data yang baru diperbarui
//     });

//     // Ambil nilai kolom ke-3 dan ke-4
//     const kolom3 = updatedData.dataValues.kolomKetiga; // Ganti 'kolomKetiga' dengan nama kolom sebenarnya
//     const kolom4 = updatedData.dataValues.kolomKeempat; // Ganti 'kolomKeempat' dengan nama kolom sebenarnya

//     // Kirim respons JSON
//     res.json({
//       message: "Data Berhasil Diupdate",
//       data: {
//         kolom3,
//         kolom4,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: 'Terjadi kesalahan' });
//   }
// });

//select
// router.get("/user/profile", jwtverify, async function (req, res, next) {
//     try {
//    let userregis = await models.tabel_user.sequelize.query(`Select * form tabel user`);
//     userregis = userregis [0];
//     return res.status(200).json({
//       responCode: 200,
//       message: "suscces data",
//       data: userregis,
//     })
//     } catch (error){
//       console.log(error);
//       return res
//       .status(400)
//       .json({responCode: 400, message: error.message});
//     }
// });

/*==========================================================================================*/
