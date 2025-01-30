const express = require("express");
const routerTopic = express.Router();
const { gettopics, postNewTopic } = require("../controller");

routerTopic.get("/", gettopics);
routerTopic.post("/", postNewTopic);

module.exports = routerTopic;
