const { request, response } = require("express");
const User = require("../models/user");
const { generateJWT } = require("../helpers/generate-jwt");
const bcrypt = require("bcryptjs");

const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
      return res.status(400).json({
        msg: "Usuario / Contraseña no son correctos - contraseña",
      });
    }

    const token = await generateJWT(user._id);

    return res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: `A ocurrido un error: ${error.message}`,
    });
  }
};

module.exports = {
  login,
};
