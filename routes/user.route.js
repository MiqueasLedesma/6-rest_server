const { Router } = require("express");
const { check } = require("express-validator");

// Middlewares
const { validateFields } = require("../middlewares/validateFields");

// Validaciones
const {
  validateRol,
  emailExist,
  userByIdExist,
} = require("../helpers/db-validators");

// Controladores
const {
  userGet,
  userPut,
  userPost,
  userDelete,
} = require("../controllers/user.controller");

const router = Router();

router.get(
  "/",
  [
    check("limit", "limit debe ser un número").isNumeric(),
    check("skip", "skip debe ser un número"),
  ],
  userGet
);

router.put(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("email", "El email no es válido").isEmail(),
    check("id").custom(userByIdExist),
    check("role").custom(validateRol),
    validateFields,
  ],
  userPut
);

router.post(
  "/",
  [
    check("email", "El email no es válido").isEmail(),
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check(
      "password",
      "La contraseña es obligatoria, debe tener mas de 6 letras"
    ).isLength({ min: 6 }),
    check("role").custom(validateRol),
    check("email").custom(emailExist),
    validateFields,
  ],
  userPost
);

router.delete(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(userByIdExist),
    validateFields,
  ],
  userDelete
);

module.exports = router;
