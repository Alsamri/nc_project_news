const endpointsJson = require("../endpoints.json");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app.js");
require("jest-sorted");
const {
  topicData,
  userData,
  articleData,
  commentData,
} = require("../db/data/test-data/index.js");
const Test = require("supertest/lib/test.js");

beforeEach(() => {
  return seed({ topicData, userData, articleData, commentData });
});

afterAll(() => {
  db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array detailing all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toEqual(topicData);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the right article by the id object detailing all its proporties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article.title).toBe(
          "Living in the shadow of a great man"
        );
        expect(response.body.article.topic).toBe("mitch");
        expect(response.body.article.author).toBe("butter_bridge");
        expect(response.body.article.body).toBe(
          "I find this existence challenging"
        );
        expect(response.body.article.created_at).toBe(
          "2020-07-09T20:11:00.000Z"
        );
        expect(response.body.article.votes).toBe(100);
        expect(response.body.article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(response.body.article.article_id).toBe(1);
        expect(response.body.article).toHaveProperty("comment_count");
        expect(typeof response.body.article.comment_count).toBe("string");
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article does not exist");
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/articlenumbers")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request!");
      });
  });
});

describe("GET /api/articles/", () => {
  test("GET: 200 an articles array of article objects ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.result).toBeInstanceOf(Array);
        expect(response.body.result.length).toBeGreaterThan(1);

        response.body.result.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              title: expect.any(String),
              author: expect.any(String),
              votes: expect.any(Number),
              article_id: expect.any(Number),
              article_img_url: expect.any(String),
              created_at: expect.any(String),
              topic: expect.any(String),
              comment_count: expect.any(String),
            })
          );
          expect(article).not.toHaveProperty("body");
          expect(response.body.result).toBeSortedBy("created_at", {
            descending: true,
          });
        });
      });
  });
  test("GET: 200  respond with article by topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((result) => {
        expect(result.body.result).toBeInstanceOf(Array);
        result.body.result.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("GET: 400 - responds with an error for an invalid sort query", () => {
    return request(app)
      .get("/api/articles?sort_by=invalidentery")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Query!");
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("GET: 200 responds with an array of comments for the given article id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toBeInstanceOf(Array);
        expect(comment.length).toBeGreaterThan(0);
        comment.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
          expect(comment.article_id).toEqual(1);
        });

        expect(comment).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/articlenumbers")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("POST: 201 Responds with the posted comment", () => {
    const postedComment = {
      username: "butter_bridge",
      body: "this have been posted as a new comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(postedComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual(
          expect.objectContaining({
            created_at: expect.any(Number),
            article_id: 1,
            author: "butter_bridge",
            body: "this have been posted as a new comment",
            created_at: expect.any(String),
            votes: 0,
          })
        );
      });
  });
  test("POST: 400 Send an error message when username or body is invalid", () => {
    const invalidPost = { username: "butter_bridge" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(invalidPost)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Invalid insertion");
      });
  });
  test("POST: 400 sends an appropriate status and error message when given an invalid id", () => {
    const invalidPost = {
      username: "butter_bridge",
      body: "this have been posted as a new comment",
    };
    return request(app)
      .post("/api/articles/not_a_number/comments")
      .send(invalidPost)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });
  test("POST: 404 Send an error message when artice id is invalid", () => {
    const invalidPost = {
      username: "butter_bridge",
      body: "this have been posted as a new comment",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(invalidPost)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("article does not exist");
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("PATCH : 200 Updates the article's votes and send back the article", () => {
    const newVote = { inc_votes: 5 };

    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            votes: expect.any(Number),
            title: expect.any(String),
            author: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
          })
        );
        expect(body.article.votes).toBe(105);
      });
  });
  test("PATCH : 400 sends an appropriate status and error message when given an invalid id", () => {
    const newVote = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/not_a_number")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });
  test("PATCH : 400 Responds with an error when inc votes is not a number ", () => {
    const newVote = { inc_votes: "not_a_number" };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });
  test("PATCH : 404 Responds with an error when article ID does not exist ", () => {
    const newVote = { inc_votes: 15 };
    return request(app)
      .patch("/api/articles/800")
      .send(newVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE: 204 deletes the comment with no response", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE: 400 responds with an error for invalid id ", () => {
    return request(app)
      .delete("/api/comments/not_a_number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });
  test("DELETE: 404 responds with an error if comment id does not exist", () => {
    return request(app)
      .delete("/api/comments/800")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment does not exist");
      });
  });
});
describe("GET /api/users", () => {
  test("GET: 200 responds with all users in an array", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toBeInstanceOf(Array);
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect.objectContaining({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
