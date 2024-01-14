require("dotenv").config();
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const generateJWT = (uid = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid: uid.toString() };

    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      {
        expiresIn: "4h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

const checkJWT = async (token) => {
  try {
    if (token.length < 10) return null;

    const { uid } = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(uid);

    if (user && user.state) {
      return user;
    } else return null;
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateJWT,
  checkJWT
};
