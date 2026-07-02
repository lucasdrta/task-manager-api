import { getDb } from "../db/index.js";
import { tasks, type Task } from "../db/schema/tasks.js";

export interface CreateTaskInput {
  title: string;
  description?: string | null;
}

export class CreateTaskUseCase {
  async execute(input: CreateTaskInput): Promise<Task> {
    const [task] = await getDb()
      .insert(tasks)
      .values({
        title: input.title,
        description: input.description ?? null,
      })
      .returning();

    return task;
  }
}
