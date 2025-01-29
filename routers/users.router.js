const express = require("express");
const routerUser = express.Router();
const { selectAllUsers } = require("../controller");

routerUser.get("/", selectAllUsers);

module.exports = routerUser;
