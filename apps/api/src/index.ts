import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createAuth } from './auth'
import memesRoute from './routes/memes'
import tagsRoute from './routes/tags'

type Bindings = {
  DATABASE_URL: string
	CORS_ORIGIN: string
	GOOGLE_CLIENT_ID: string
	GOOGLE_CLIENT_SECRET: string
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

app.on(['GET', 'POST'], '/api/auth/*', (c) => {
  const auth = createAuth(c.env)
  return auth.handler(c.req.raw)
})

app.route('/api/memes', memesRoute)
app.route('/api', tagsRoute)

export default app