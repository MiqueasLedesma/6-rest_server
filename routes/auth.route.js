const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields, validateJWT } = require("../middlewares");

const { auth } = require("../controllers");
const { emailExist } = require("../helpers");

const router = Router();

router.post(
  "/login",
  [
    check("email", "Email Obligatorio / Invalido").not().isEmpty().isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validateFields,
  ],
  auth.login
);

router.post(
  "/google",
  [
    check("id_token", "id_token es obligatorio").not().isEmpty(),
    validateFields,
  ],
  auth.googleSignIn
);

router.get("/", [validateJWT, validateFields], auth.renewToken);

module.exports = router;
