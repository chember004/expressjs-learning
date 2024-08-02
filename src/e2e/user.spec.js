import request from "supertest";
import { createApp } from "../createApp.mjs";
import mongoose from "mongoose";

describe("create user and login", () => {
  let app;
  beforeAll(() => {
    mongoose
      .connect("mongodb://127.0.0.1/express_tutorial_test")
      .then(() => console.log("Connected to database"))
      .catch((err) => console.log(`Error: ${err}`));

    app = createApp();
  });

  it("should create the user", async () => {
    const response = await request(app).post("/api/users").send({
      username: "sample",
      password: "hashed_password",
      name: "chumber",
      age: 29,
    });
    expect(response.statusCode).toBe(201);
  });

  it("should log the user in and /api/auth/status and return auth user", async () => {
    const response = await request(app)
      .post("/api/auth")
      .send({
        username: "sample",
        password: "hashed_password",
      })
      .then((res) =>
        request(app)
          .get("/api/auth/status")
          .set("Cookie", res.headers["set-cookie"])
      );
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe("sample");
    expect(response.body.name).toBe("chumber");
  });

  //   it("should visit /api/auth/status and return authenticate user", async () => {
  //     const response = await request(app).get("/api/auth/status");
  //     expect(response.statusCode).toBe(200);
  //   });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
