const db = require("./db/connection.js");

exports.alltopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};

exports.getArticles = (sort_by = "created_at", order = "DESC") => {
  return db
    .query(
      `SELECT 
          articles.article_id, 
          articles.title, 
          articles.author, 
          articles.votes, 
          articles.article_img_url, 
          articles.created_at, 
          articles.topic,
          COUNT(comments.comment_id) AS comment_count
       FROM articles 
       LEFT JOIN comments 
       ON articles.article_id = comments.article_id
       GROUP BY articles.article_id
       ORDER BY ${sort_by} ${order};`
    )
    .then((article) => {
      console.log(article.rows);
      return article.rows;
    });
};
exports.getarticlesid = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `article does not exist`,
        });
      }

      return result.rows[0];
    });
};

exports.gettingArticlesById = (article_id) => {
  return db
    .query(
      ` SELECT comment_id, votes, created_at, author, body, article_id
      FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC;`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `article does not exist`,
        });
      }
      return result.rows;
    });
};
