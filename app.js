const express = require("express");
const app = express();
const router = require("./routers/api.routers");
const cors = require("cors");
app.use(cors({ origin: "https://aloisa.netlify.app" }));

app.use(express.json());

app.use("/api", router);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02" || "23502") {
    res.status(400).send({ msg: "Bad Request!" });
  } else if (err.code === "23505") {
    res.status(409).send({ msg: "Topic already exists" });
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
