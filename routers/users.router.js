const express = require("express");
const routerUser = express.Router();
const { selectAllUsers, getUserbyUsername } = require("../controller");

routerUser.get("/", selectAllUsers);
routerUser.get("/:username", getUserbyUsername);

module.exports = routerUser;
