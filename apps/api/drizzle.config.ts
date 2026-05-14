import { defineConfig } from 'drizzle-kit'
import dotenv from 'dotenv'

const envFile = process.env.ENV === 'prod' ? '.env.prod' : '.dev.vars'
dotenv.config({ path: envFile })

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out:    './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})