const fs = require("fs");
const path = require("path");
const {
  alltopics,
  getArticles,
  getarticlesid,
  gettingArticlesById,
  addNewComment,
  updateVotesById,
  deleteCommentById,
  allUsers,
  selectUserByUsername,
  incVotesbyCommentId,
  addNewArticle,
  addNewTopic,
  deleteArticles,
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
exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, topic, limit, page } = req.query;
  getArticles(req.query)
    .then((result) => {
      res.status(200).send({ result });
    })
    .catch(next);
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

exports.postnewcomment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  if (isNaN(Number(article_id))) {
    return res.status(400).send({ msg: "Bad Request!" });
  }
  if (!username || !body) {
    return res.status(400).send({ msg: "Invalid insertion" });
  }
  addNewComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.postNewTopic = (req, res, next) => {
  const { slug, description } = req.body;
  if (!slug || !description) {
    return res.status(400).send({ msg: "Invalid insertion" });
  } else if (typeof slug != "string" || typeof description != "string") {
    return res.status(400).send({ msg: "Bad Request!" });
  }
  addNewTopic(slug, description)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
exports.postNewArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;
  if (!author || !title || !body || !topic) {
    return res.status(400).send({ msg: "Invalid insertion" });
  }
  addNewArticle(author, title, body, topic, article_img_url)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};
exports.patchVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateVotesById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
exports.patchCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  incVotesbyCommentId(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
exports.deleteByid = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.deleteArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  deleteArticles(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
exports.selectAllUsers = (req, res, next) => {
  allUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};
exports.getUserbyUsername = (req, res, next) => {
  const { username } = req.params;
  selectUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
