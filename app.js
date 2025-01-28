const express = require("express");
const app = express();
const {
  getAllDocs,
  gettopics,
  getArticleById,
  getNewArticles,
  getcommentsById,
} = require("./controller");

app.use(express.json());

app.get("/api", getAllDocs);

app.get("/api/topics", gettopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getNewArticles);
app.get("/api/articles/:article_id/comments", getcommentsById);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02" || "23502") {
    res.status(400).send({ msg: "Bad Request!" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ error: err, msg: "internal server error" });
});
module.exports = app;
