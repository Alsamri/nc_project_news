const express = require("express");
const app = express();
const {
  getAllDocs,
  gettopics,
  getArticleById,
  getAllArticles,
  getcommentsById,
  postnewcomment,
  patchVotes,
  deleteByid,
  selectAllUsers,
} = require("./controller");

app.use(express.json());

app.get("/api", getAllDocs);

app.get("/api/topics", gettopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getcommentsById);
app.post("/api/articles/:article_id/comments", postnewcomment);
app.patch("/api/articles/:article_id", patchVotes);
app.delete("/api/comments/:comment_id", deleteByid);
app.get("/api/users", selectAllUsers);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02" || "23502") {
    res.status(400).send({ msg: "Bad Request!" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "article does not exist" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ error: err, msg: "internal server error" });
});
module.exports = app;
