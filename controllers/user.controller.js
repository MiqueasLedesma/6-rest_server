const { response, request } = require("express");

const userGet = (req = request, res = response) => {
  const { name, apiKey } = req.query;

  return res.json({
    msg: "get API - controller",
    apiKey,
    name,
  });
};

const userPut = (req, res = response) => {
  const { id } = req.params;

  return res.json({
    msg: "put API - controller",
    id,
  });
};

const userPost = (req = request, res = response) => {
  const { name, lastname } = req.body;
  return res.json({
    msg: "post API - controller",
    lastname,
    name,
  });
};

const userDelete = (req, res = response) =>
  res.json({
    msg: "delete API - controller",
  });

module.exports = {
  userGet,
  userPut,
  userPost,
  userDelete,
};
