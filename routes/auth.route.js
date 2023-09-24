const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields } = require("../middlewares/validateFields");

const { login } = require("../controllers/auth.controller");
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

module.exports = router;
