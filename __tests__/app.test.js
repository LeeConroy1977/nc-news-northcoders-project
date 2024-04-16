const app = require("../app.js");
require("jest-sorted");
const request = require("supertest");
const endpoints = require("../endpoints.json");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const {
  topicData,
  userData,
  articleData,
  commentData,
} = require("../db/data/test-data/index.js");

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe("tests for nc_news", () => {
  describe("/api/topics", () => {
    test("STATUS:404 - should respond with a 404 error if the endpoint is invalid", () => {
      return request(app)
        .get("/api/9999")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid Endpoint");
        });
    });
  });
  describe("/api", () => {
    test("GET:200 should return identical data compared to the json file", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((res) => {
          const data = res.body.data;
          expect(data).toEqual(endpoints);
        });
    });
  });

  describe("/api/topics", () => {
    test("GET:200 sends an array of topics to the client with the correct length and datatype", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          const { topics } = res.body;
          expect(topics.length).toBe(3);
          topics.forEach((topic) => {
            expect(typeof topic.description).toBe("string");
            expect(typeof topic.slug).toBe("string");
          });
        });
    });
    test("GET:200 topics[0] should match given object", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          const { topics } = res.body;
          expect(topics[0]).toMatchObject({
            description: "The man, the Mitch, the legend",
            slug: "mitch",
          });
        });
    });
  });

  describe("/api/articles", () => {
    test("GET:200 sends an array of articles to the client with the correct length and datatype", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.comment_count).toBe("number");
          });
        });
    });
    test("GET:200 articles[0] should match given object", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles[0]).toMatchObject({
            author: "icellusedkars",
            title: "Eight pug gifs that remind me of mitch",
            article_id: 3,
            topic: "mitch",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 2,
          });
        });
    });
    test("GET:200 articles array should be sort by article.created_at in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
  });

  describe("/api/articles/:articles_id", () => {
    test("GET:200 should return a given article of a matching article_id", () => {
      return request(app)
        .get("/api/articles/5")
        .expect(200)
        .then((res) => {
          const { article } = res.body;
          expect(article).toMatchObject({
            article_id: 5,
            title: "UNCOVERED: catspiracy to bring down democracy",
            topic: "cats",
            author: "rogersop",
            body: "Bastet walks amongst us, and the cats are taking arms!",
            created_at: "2020-08-03T13:14:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("STATUS:404 Should return a custom err.status and err.msg", () => {
      return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Artical does not exist");
        });
    });
    test("STATUS:400 Should return 400 status with the err.msg 'Bad Request'", () => {
      return request(app)
        .get("/api/articles/string")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Bad Request");
        });
    });
  });
});
