import request from "supertest";
import { describe, expect, it } from "vitest";
import { App } from "../src/app.js";

describe("GET /health", () => {
  const app = new App().instance;

  it("returns status ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});
