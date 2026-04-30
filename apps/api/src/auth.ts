import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import dotenv from 'dotenv'
import * as schema from './db/schema'

dotenv.config({ path: '.dev.vars' })

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

export default betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
  },
})