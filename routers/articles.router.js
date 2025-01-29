const express = require("express");
const routerArticle = express.Router();
const {
  getArticleById,
  getAllArticles,
  getcommentsById,
  postnewcomment,
  patchVotes,
} = require("../controller");

routerArticle.get("/", getAllArticles);
routerArticle.get("/:article_id", getArticleById);
routerArticle.get("/:article_id/comments", getcommentsById);
routerArticle.post("/:article_id/comments", postnewcomment);
routerArticle.patch("/:article_id", patchVotes);

module.exports = routerArticle;
