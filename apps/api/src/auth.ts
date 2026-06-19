import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { createDb } from './db/client'

export type AuthEnv = {
	DATABASE_URL: string
	CORS_ORIGIN?: string
	API_URL?: string
	GOOGLE_CLIENT_ID?: string
	GOOGLE_CLIENT_SECRET?: string
	GOOGLE_AUTH_ENABLED?: string
	TWITTER_CLIENT_ID?: string
	TWITTER_CLIENT_SECRET?: string
	TWITTER_AUTH_ENABLED?: string
	DISCORD_CLIENT_ID?: string
	DISCORD_CLIENT_SECRET?: string
	DISCORD_AUTH_ENABLED?: string
	EMAIL_AUTH_ENABLED?: string
}

export function createAuth(env: AuthEnv) {
	const db = createDb(env.DATABASE_URL)

	const socialProviders: Record<string, { clientId: string; clientSecret: string }> = {}
	if (env.GOOGLE_AUTH_ENABLED === 'true' && env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
		socialProviders.google = {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		}
	}
	if (env.TWITTER_AUTH_ENABLED === 'true' && env.TWITTER_CLIENT_ID && env.TWITTER_CLIENT_SECRET) {
		socialProviders.twitter = {
			clientId: env.TWITTER_CLIENT_ID,
			clientSecret: env.TWITTER_CLIENT_SECRET,
		}
	}
	if (env.DISCORD_AUTH_ENABLED === 'true' && env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET) {
		socialProviders.discord = {
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET,
		}
	}

  return betterAuth({
		baseURL: env.API_URL ?? 'http://localhost:8787',
    database: drizzleAdapter(db, {
      provider: 'pg',
    }),
    emailAndPassword: {
      enabled: env.EMAIL_AUTH_ENABLED === 'true',
    },
		socialProviders: socialProviders,
		trustedOrigins: [env.CORS_ORIGIN ?? 'http://localhost:3000'],
  })
}
