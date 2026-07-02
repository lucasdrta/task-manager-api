import { asc } from "drizzle-orm";
import { getDb } from "../db/index.js";
import { tasks, type Task } from "../db/schema/tasks.js";

export class ListTasksUseCase {
  async execute(): Promise<Task[]> {
    return getDb().select().from(tasks).orderBy(asc(tasks.createdAt));
  }
}
