import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3335),
  DATABASE_CLIENT: z.enum(["sqlite", "pg"])
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid environment variables!", _env.error.format());
  throw new Error("Invalid environment variables!");
}

export const env = _env.data;
