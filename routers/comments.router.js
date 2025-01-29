const express = require("express");
const routercomment = express.Router();
const { deleteByid } = require("../controller");

routercomment.delete("/:comment_id", deleteByid);

module.exports = routercomment;
