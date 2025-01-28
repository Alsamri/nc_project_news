const fs = require("fs");
const path = require("path");
const {
  alltopics,
  getArticles,
  getarticlesid,
  fetchArticlesById,
  gettingArticlesById,
} = require("./model");

exports.getAllDocs = (req, res, next) => {
  const theFilePath = path.join(__dirname, "./endpoints.json");
  fs.readFile(theFilePath, "utf-8", (err, docsData) => {
    if (err) {
      console.log(err, "error here");

      return next(err);
    } else {
      const endpoints = JSON.parse(docsData);

      res.status(200).send({ endpoints });
    }
  });
};
exports.gettopics = (req, res, next) => {
  alltopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
exports.getNewArticles = (req, res, next) => {
  const { sort_by, order } = req.query;
  getArticles(sort_by, order).then((result) => {
    res.status(200).send({ result });
  });
};
exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  getarticlesid(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getcommentsById = (req, res, next) => {
  const { article_id } = req.params;
  gettingArticlesById(article_id)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
