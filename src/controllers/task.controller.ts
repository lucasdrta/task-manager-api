import type { Request, Response } from "express";
import { CreateTaskUseCase } from "../usecases/create-task.usecase.js";
import { DeleteTaskUseCase } from "../usecases/delete-task.usecase.js";
import { ListTasksUseCase } from "../usecases/list-tasks.usecase.js";
import { UpdateTaskStatusUseCase } from "../usecases/update-task-status.usecase.js";

export class TaskController {
  constructor(
    private readonly listTasksUseCase: ListTasksUseCase = new ListTasksUseCase(),
    private readonly createTaskUseCase: CreateTaskUseCase = new CreateTaskUseCase(),
    private readonly updateTaskStatusUseCase: UpdateTaskStatusUseCase = new UpdateTaskStatusUseCase(),
    private readonly deleteTaskUseCase: DeleteTaskUseCase = new DeleteTaskUseCase(),
  ) {}

  list = async (_req: Request, res: Response): Promise<void> => {
    const tasks = await this.listTasksUseCase.execute();
    res.status(200).json(tasks);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const { title, description } = req.body as {
      title?: string;
      description?: string;
    };

    if (!title?.trim()) {
      res.status(400).json({ error: "title is required" });
      return;
    }

    const task = await this.createTaskUseCase.execute({
      title: title.trim(),
      description,
    });

    res.status(201).json(task);
  };

  updateStatus = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const { completed } = req.body as { completed?: boolean };

    if (Number.isNaN(id)) {
      res.status(400).json({ error: "invalid id" });
      return;
    }

    if (typeof completed !== "boolean") {
      res.status(400).json({ error: "completed is required" });
      return;
    }

    const task = await this.updateTaskStatusUseCase.execute(id, completed);

    if (!task) {
      res.status(404).json({ error: "task not found" });
      return;
    }

    res.status(200).json(task);
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({ error: "invalid id" });
      return;
    }

    const deleted = await this.deleteTaskUseCase.execute(id);

    if (!deleted) {
      res.status(404).json({ error: "task not found" });
      return;
    }

    res.status(204).send();
  };
}
