import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createAuth } from './auth'
import memesRoute from './routes/memes'
import tagsRoute from './routes/tags'

type Bindings = {
	DATABASE_URL: string
	CORS_ORIGIN?: string
	GOOGLE_CLIENT_ID?: string
	GOOGLE_CLIENT_SECRET?: string
	GOOGLE_AUTH_ENABLED?: string
	TWITTER_CLIENT_ID?: string
	TWITTER_CLIENT_SECRET?: string
	TWITTER_AUTH_ENABLED?: string
	EMAIL_AUTH_ENABLED?: string
	memendex_images: R2Bucket
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', (c, next) => {
  const corsMiddleware = cors({
    origin: c.env.CORS_ORIGIN ?? 'http://localhost:3000',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
  return corsMiddleware(c, next)
})

app.get('/api/auth/providers', (c) => {
	return c.json({
		email: c.env.EMAIL_AUTH_ENABLED === 'true',
		google: c.env.GOOGLE_AUTH_ENABLED === 'true' && !!c.env.GOOGLE_CLIENT_ID && !!c.env.GOOGLE_CLIENT_SECRET,
		twitter: c.env.TWITTER_AUTH_ENABLED === 'true' && !!c.env.TWITTER_CLIENT_ID && !!c.env.TWITTER_CLIENT_SECRET,
	})
})

app.on(['GET', 'POST'], '/api/auth/*', (c) => {
  const auth = createAuth(c.env)
  return auth.handler(c.req.raw)
})

app.route('/api/memes', memesRoute)
app.route('/api', tagsRoute)

export default app