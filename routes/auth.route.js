const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields } = require("../middlewares/validateFields");

const { login, googleSignIn } = require("../controllers/auth.controller");
const { credentialsCheck } = require("../helpers/db-validators");

const router = Router();

router.post(
  "/login",
  [
    check("email").custom(credentialsCheck),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validateFields,
  ],
  login
);

router.post(
  "/google",
  [
    check("id_token", "id_token es obligatorio").not().isEmpty(),
    validateFields,
  ],
  googleSignIn
);


module.exports = router;
