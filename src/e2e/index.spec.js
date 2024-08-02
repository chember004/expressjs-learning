import request from "supertest";
import { createApp } from "../createApp.mjs";
import mongoose from "mongoose";

describe("hello endpoint", () => {
  let app;
  beforeAll(() => {
    mongoose
      .connect("mongodb://127.0.0.1/express_tutorial_test")
      .then(() => console.log("Connected to database"))
      .catch((err) => console.log(`Error: ${err}`));

    app = createApp();
  });

  it("should return 401 when not logged in", async () => {
    const response = await request(app).get("/api/auth/status");
    expect(response.statusCode).toBe(401);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
