const db = require("./db/connection.js");

exports.alltopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};

exports.getArticles = (sort_by = "created_at", order = "DESC", topic) => {
  const greenQuery = [
    "created_at",
    "author",
    "title",
    "topic",
    "votes",
    "comment_count",
  ];

  if (!greenQuery.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid Query!" });
  }
  let Args = [];
  let SQLstr = `SELECT 
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
       ON articles.article_id = comments.article_id`;
  if (topic) {
    SQLstr += ` WHERE articles.topic = $1`;
    Args.push(topic);
  }
  SQLstr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

  return db.query(SQLstr, Args).then((article) => {
    if (article.rowCount === 0) {
      return Promise.reject({ status: 404, msg: "article does not exist" });
    }
    return article.rows;
  });
};
exports.getarticlesid = (article_id) => {
  return db
    .query(
      `SELECT articles.*, 
        COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`,
      [article_id]
    )
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

exports.addNewComment = (article_id, username, body) => {
  return db
    .query(
      `INSERT INTO comments (article_id, author, body, created_at, votes) 
      VALUES ($1,$2,$3,NOW(),0)
    RETURNING *;`,
      [article_id, username, body]
    )
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      if (err.code === "23503") {
        return Promise.reject({
          status: 404,
          msg: `article does not exist`,
        });
      }
    });
};
exports.addNewTopic = (slug, description) => {
  return db
    .query(
      `INSERT INTO topics (slug, description)
  VALUES ($1,$2) RETURNING *;`,
      [slug, description]
    )
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      if (err.code === "23505") {
        return Promise.reject({
          status: 409,
          msg: "Topic already exists",
        });
      }
      return Promise.reject(err);
    });
};
exports.addNewArticle = (
  author,
  title,
  body,
  topic,
  article_img_url = "http://DefaultURL-IMG.jpg"
) => {
  return db
    .query(
      `INSERT INTO articles (author, title, body, topic, article_img_url, votes, created_at)
      VALUES ($1, $2, $3, $4, $5, 0, NOW())
      RETURNING article_id, author, title, body, topic, article_img_url, votes, created_at;`,
      [author, title, body, topic, article_img_url]
    )
    .then((result) => {
      const insertedArticle = result.rows[0];
      insertedArticle.comment_count = 0;

      return insertedArticle;
    })
    .catch((err) => {
      if (err.code === "23503") {
        return Promise.reject({
          status: 404,
          msg: `article does not exist`,
        });
      }
    });
};
exports.updateVotesById = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`,
      [inc_votes, article_id]
    )
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
exports.deleteCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])

    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `Comment does not exist`,
        });
      }
    });
};
exports.deleteArticles = (article_id) => {
  return db
    .query(`DELETE FROM comments WHERE article_id = $1 RETURNING *;`, [
      article_id,
    ])
    .then(() => {
      return db.query(
        `DELETE FROM articles WHERE article_id = $1 RETURNING *;`,
        [article_id]
      );
    })

    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `Article does not exist`,
        });
      }
    });
};

exports.incVotesbyCommentId = (comment_id, inc_votes) => {
  return db
    .query(
      `UPDATE comments SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING *;`,
      [inc_votes, comment_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `comment does not exist`,
        });
      }

      return result.rows[0];
    });
};

exports.allUsers = () => {
  return db.query(`SELECT * FROM users;`).then((result) => {
    return result.rows;
  });
};

exports.selectUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `User does not exist`,
        });
      }
      return result.rows[0];
    });
};
