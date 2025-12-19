import type { Config } from "drizzle-kit";
import 'dotenv/config';

export default {
  schema: "./db/schema",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;

