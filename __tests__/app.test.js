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
/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */
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
  it("GET: 200 an articles array of article objects ", () => {
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
});
describe("GET /api/articles/:article_id/comments", () => {
  test("GET: 200 Responds with an array of comments for the given article id", () => {
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
