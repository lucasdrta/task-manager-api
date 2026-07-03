export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "Task Manager API",
    version: "1.0.0",
    description: "API para gerenciar tarefas (todolist).",
  },
  servers: [
    {
      url: "http://localhost:3333",
      description: "Local",
    },
  ],
  tags: [
    { name: "Health", description: "Verificação de saúde da API" },
    { name: "Tasks", description: "Operações de tarefas" },
  ],
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        operationId: "healthCheck",
        responses: {
          "200": {
            description: "API está saudável",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HealthResponse",
                },
              },
            },
          },
        },
      },
    },
    "/tasks": {
      get: {
        tags: ["Tasks"],
        summary: "Listar tarefas",
        operationId: "listTasks",
        responses: {
          "200": {
            description: "Lista de tarefas",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Task" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Tasks"],
        summary: "Criar tarefa",
        operationId: "createTask",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTaskRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Tarefa criada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Task" },
              },
            },
          },
          "400": {
            description: "Dados inválidos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/tasks/{id}/status": {
      patch: {
        tags: ["Tasks"],
        summary: "Atualizar status da tarefa",
        operationId: "updateTaskStatus",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateTaskStatusRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Tarefa atualizada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Task" },
              },
            },
          },
          "400": {
            description: "Dados inválidos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Tarefa não encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/tasks/{id}": {
      delete: {
        tags: ["Tasks"],
        summary: "Deletar tarefa",
        operationId: "deleteTask",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "204": {
            description: "Tarefa removida",
          },
          "400": {
            description: "ID inválido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Tarefa não encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      HealthResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "ok" },
        },
        required: ["status"],
      },
      Task: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "Buy milk" },
          description: {
            type: "string",
            nullable: true,
            example: "2L",
          },
          completed: { type: "boolean", example: false },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
        required: [
          "id",
          "title",
          "completed",
          "createdAt",
          "updatedAt",
        ],
      },
      CreateTaskRequest: {
        type: "object",
        properties: {
          title: { type: "string", example: "Buy milk" },
          description: { type: "string", example: "2L" },
        },
        required: ["title"],
      },
      UpdateTaskStatusRequest: {
        type: "object",
        properties: {
          completed: { type: "boolean", example: true },
        },
        required: ["completed"],
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string", example: "title is required" },
        },
        required: ["error"],
      },
    },
  },
} as const;
