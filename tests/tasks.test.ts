import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { App } from "../src/app.js";

vi.mock("../src/usecases/list-tasks.usecase.js", () => ({
  ListTasksUseCase: class {
    execute = vi.fn().mockResolvedValue([
      {
        id: 1,
        title: "Buy milk",
        description: null,
        completed: false,
        createdAt: new Date("2026-07-02T00:00:00.000Z"),
        updatedAt: new Date("2026-07-02T00:00:00.000Z"),
      },
    ]);
  },
}));

vi.mock("../src/usecases/create-task.usecase.js", () => ({
  CreateTaskUseCase: class {
    execute = vi.fn().mockResolvedValue({
      id: 2,
      title: "New task",
      description: "Details",
      completed: false,
      createdAt: new Date("2026-07-02T00:00:00.000Z"),
      updatedAt: new Date("2026-07-02T00:00:00.000Z"),
    });
  },
}));

vi.mock("../src/usecases/update-task-status.usecase.js", () => ({
  UpdateTaskStatusUseCase: class {
    execute = vi.fn().mockResolvedValue({
      id: 1,
      title: "Buy milk",
      description: null,
      completed: true,
      createdAt: new Date("2026-07-02T00:00:00.000Z"),
      updatedAt: new Date("2026-07-02T00:00:00.000Z"),
    });
  },
}));

vi.mock("../src/usecases/delete-task.usecase.js", () => ({
  DeleteTaskUseCase: class {
    execute = vi.fn().mockResolvedValue(true);
  },
}));

describe("GET /tasks", () => {
  const app = new App().instance;

  it("returns tasks list", async () => {
    const response = await request(app).get("/tasks");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      id: 1,
      title: "Buy milk",
      completed: false,
    });
  });
});

describe("POST /tasks", () => {
  const app = new App().instance;

  it("creates a task", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({ title: "New task", description: "Details" });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: 2,
      title: "New task",
      description: "Details",
      completed: false,
    });
  });

  it("returns 400 when title is missing", async () => {
    const response = await request(app).post("/tasks").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "title is required" });
  });
});

describe("PATCH /tasks/:id/status", () => {
  const app = new App().instance;

  it("updates task status", async () => {
    const response = await request(app)
      .patch("/tasks/1/status")
      .send({ completed: true });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 1,
      title: "Buy milk",
      completed: true,
    });
  });

  it("returns 400 when completed is missing", async () => {
    const response = await request(app).patch("/tasks/1/status").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "completed is required" });
  });
});

describe("DELETE /tasks/:id", () => {
  const app = new App().instance;

  it("deletes a task", async () => {
    const response = await request(app).delete("/tasks/1");

    expect(response.status).toBe(204);
  });
});
