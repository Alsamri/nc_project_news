const express = require("express");
const app = express();
const { getAllDocs, gettopics, getArticleById } = require("./controller");

app.use(express.json());

app.get("/api", getAllDocs);

app.get("/api/topics", gettopics);

app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ error: err });
});
module.exports = app;
