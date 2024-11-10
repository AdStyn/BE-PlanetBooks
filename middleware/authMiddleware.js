const jwt = require('jsonwebtoken');
function jwtverify(req, res, next) {
let token = req.header('Authorization');
if (!token) return res.status(401).json({ error: 'Access denied' });
try {
 token = token.split(" ")[1];
 const decoded = jwt.verify(token, 'ady-aiti');
 req.userId = decoded.userId;
 next();
 } catch (error) {
    console.log(error);
 res.status(401).json({ error: 'Invalid token' });
 }
 };

module.exports = jwtverify;
//=============================================================================================================

// const jwt = require('jsonwebtoken');
// const token = req.header('Authorization');
// const { verify, sign } = require("jsonwebtoken");
// require("dotenv").config();
// function verifyToken(req, res, next) {
// if (!token) return res.status(401).json({ error: 'Access denied' });
// try {
//  const decoded = jwt.verify(token, 'your-secret-key');
//  req.userId = decoded.userId;
//  next();
//  } catch (error) {
//  res.status(401).json({ error: 'Invalid token' });
//  }
//  };
// module.exports = verifyToken;
//==============================================================================================================

// const { verify, sign } = require("jsonwebtoken");
// require("dotenv").config();
// module.exports = {
//   jwtverify: async (req, res, next) => {
//     try {
//       let token = req.headers.authorization.split(" ")[1];
//       req.decode = verify(token, process.env.SECRET_LOGIN);
//       next();
//     } catch (error) {
//       return res
//         .status(400)
//         .json({ responseCode: 400, message: "Invalid Signature" });
//     }
//   },
//   fungsilogin: (payload) => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         let token = sign(payload, process.env.SECRET_LOGIN);
//         resolve(token);
//       } catch (error) {
//         reject(error.message);
//       }
//     });
//   },
// };


