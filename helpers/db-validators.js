const Role = require("../models/role");
const User = require("../models/user");

const validateRol = async (role = "") => {
  const exist = await Role.findOne({ role });
  if (!exist) throw new Error(`El rol: ${role} no es válido`);
};

const emailExist = async (email = "") => {
  const exist = await User.findOne({ email });
  if (exist) throw new Error(`El email: ${email}, ya esta registrado`);
};

const userByIdExist = async (id ="") => {
  const exist = await User.findById(id);
  if(!exist) throw new Error(`El usuario con ID: ${id} no existe`);
}

module.exports = {
  validateRol,
  emailExist, 
  userByIdExist
};
