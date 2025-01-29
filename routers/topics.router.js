const express = require("express");
const routerTopic = express.Router();
const { gettopics } = require("../controller");

routerTopic.get("/", gettopics);

module.exports = routerTopic;
