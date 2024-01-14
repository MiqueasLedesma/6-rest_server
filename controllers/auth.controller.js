const { request, response } = require("express");
const User = require("../models/user");
const { generateJWT } = require("../helpers/generate-jwt");
const bcrypt = require("bcryptjs");
const { googleVerify } = require("../helpers/google-verify");

module.exports = {
  login: async (req = request, res = response) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) throw new Error("El usuario no existe");

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
  },
  googleSignIn: async (req = request, res = response) => {
    const { id_token } = req.body;

    try {
      const { email, name, picture } = await googleVerify(id_token);

      let user = await User.findOne({ email });

      if (!user) {
        // Crear usuario

        const data = {
          name,
          email,
          password: ":p",
          google: true,
          img: picture,
        };

        user = new User(data);
        await user.save();
      }
      // Si el usuario en DB
      if (!user.state) {
        return res.status(401).json({
          msg: "Hable con el administrador, usuario bloqueado",
        });
      }

      const token = await generateJWT(user._id);

      return res.json({
        msg: "ok",
        user,
        token,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        msg: `A ocurrido un error: ${error.message}`,
      });
    }
  },
  renewToken: async (req, res = response) => {
    const { user } = req;
    const token = await generateJWT(user._id);
    return res.json({ user, token });
  },
};
