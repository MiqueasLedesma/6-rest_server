const __validateFields = require("./validateFields");
const __validateJWT = require("./validate-jwt");
const __validateRole = require("./validate-role");

module.exports = {
  ...__validateFields,
  ...__validateJWT,
  ...__validateRole,
};
