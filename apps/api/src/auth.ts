import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { createDb } from './db/client'

export type AuthEnv = {
	DATABASE_URL: string
	CORS_ORIGIN?: string
	GOOGLE_CLIENT_ID: string
	GOOGLE_CLIENT_SECRET: string
}

export function createAuth(env: AuthEnv) {
  const db = createDb(env.DATABASE_URL)
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
    }),
    emailAndPassword: {
      enabled: true,
    },
		socialProviders: {
			google: {
				clientId: env.GOOGLE_CLIENT_ID,
				clientSecret: env.GOOGLE_CLIENT_SECRET
				,
			}
		},
		trustedOrigins: [env.CORS_ORIGIN ?? 'http://localhost:3000'],
  })
}