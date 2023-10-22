const bcrypt = require("bcryptjs");
const { response, request } = require("express");
const User = require("../models/user");

module.exports = {
  userGet: async (req = request, res = response) => {
    const { limit = 5, skip = 0 } = req.query;

    try {
      const [total, users] = await Promise.all([
        User.countDocuments(),
        User.find({ estate: true }).limit(limit).skip(skip),
      ]);
      return res.json({ total, users });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: error.message });
    }
  },
  userPut: async (req = request, res = response) => {
    const { id } = req.params;
    const { password, google, _id, ...rest } = req.body;

    if (password) {
      const salt = bcrypt.genSaltSync();
      rest.password = bcrypt.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, rest, {
      returnDocument: "after",
    });

    return res.json({ msg: "success", user });
  },
  userPost: async (req = request, res = response) => {
    const { name, email, password, role } = req.body;
    try {
      const user = new User({ name, email, role });

      // Encriptar la contraseña;
      const salt = bcrypt.genSaltSync();
      user.password = bcrypt.hashSync(password, salt);

      await user.save();
      return res.json({ msg: "success", user });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  userDelete: async (req = request, res = response) => {
    const { id } = req.params;

    try {
      const user = await User.findByIdAndUpdate(id, { estate: false });
      return res.json(user);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: error.message });
    }
  },
};
