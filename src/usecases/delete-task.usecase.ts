import { eq } from "drizzle-orm";
import { getDb } from "../db/index.js";
import { tasks } from "../db/schema/tasks.js";

export class DeleteTaskUseCase {
  async execute(id: number): Promise<boolean> {
    const deleted = await getDb()
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning();

    return deleted.length > 0;
  }
}
