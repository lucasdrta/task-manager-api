import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";

let queryClient: ReturnType<typeof postgres> | undefined;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | undefined;

function getConnectionString(): string {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  return connectionString;
}

export function getDb() {
  if (!dbInstance) {
    queryClient = postgres(getConnectionString());
    dbInstance = drizzle(queryClient, { schema });
  }

  return dbInstance;
}

export async function closeDatabase(): Promise<void> {
  if (!queryClient) {
    return;
  }

  await queryClient.end({ timeout: 5 });
  queryClient = undefined;
  dbInstance = undefined;
}
