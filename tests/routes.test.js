const request = require("supertest");
const app = require("../server/server");
const { connection } = require("../server/database");

describe("URL Endpoints", () => {
  test("should create a new shortened url", async done => {
    const res = await request(app)
      .post("/url")
      .send({
        url: "www.example.com"
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("shortenedURL");
    expect(res.body.realURL).toEqual("www.example.com");
    done();
  });

  test("should not create a new shortened url if the url is not valid", async done => {
    const res = await request(app)
      .post("/url")
      .send({
        url: "random text"
      });
    expect(res.statusCode).toEqual(400);
    done();
  });

  afterAll(async done => {
    // Closing the DB connection
    connection.end();
    done();
  });
});
