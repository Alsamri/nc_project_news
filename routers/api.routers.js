const express = require("express");
const router = express.Router();

const { getAllDocs } = require("../controller");
const routerTopic = require("./topics.router");
const routerArticle = require("./articles.router");
const routerUser = require("./users.router");
const routercomment = require("./comments.router");

router.get("/", getAllDocs);
router.use("/topics", routerTopic);
router.use("/articles", routerArticle);
router.use("/users", routerUser);
router.use("/comments", routercomment);

module.exports = router;
