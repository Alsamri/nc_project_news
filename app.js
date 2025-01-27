const express = require("express");
const app = express();
const { getAllDocs, gettopics } = require("./controller");

app.use(express.json());

app.get("/api", getAllDocs);

app.get("/api/topics", gettopics);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err });
});
module.exports = app;
