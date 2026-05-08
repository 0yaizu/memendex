import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { createDb } from './db/client'

export function createAuth(databaseUrl: string, corsOrigin?: string) {
  const db = createDb(databaseUrl)
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
    }),
    emailAndPassword: {
      enabled: true,
    },
		trustedOrigins: [corsOrigin ?? 'http://localhost:3000'],
  })
}