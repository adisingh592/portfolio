import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  RESEND_API_KEY: z.string().optional(),
  CONTACT_TO: z.string().optional(),
});

export const env = schema.parse(process.env);
