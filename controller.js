const fs = require("fs");
const path = require("path");
const { alltopics, getarticles } = require("./model");

exports.getAllDocs = (req, res, next) => {
  const theFilePath = path.join(__dirname, "./endpoints.json");
  fs.readFile(theFilePath, "utf-8", (err, docsData) => {
    if (err) {
      console.log(err, "error here");

      return next(err);
    } else {
      const endpoints = JSON.parse(docsData);

      res.status(200).json({ endpoints });
    }
  });
};
exports.gettopics = (req, res, next) => {
  alltopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  if (isNaN(article_id)) {
    return res.status(400).send({ msg: "Bad Request!" });
  }
  getarticles(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
