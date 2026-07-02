import { eq } from "drizzle-orm";
import { getDb } from "../db/index.js";
import { tasks, type Task } from "../db/schema/tasks.js";

export class UpdateTaskStatusUseCase {
  async execute(id: number, completed: boolean): Promise<Task | null> {
    const [task] = await getDb()
      .update(tasks)
      .set({ completed, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();

    return task ?? null;
  }
}
