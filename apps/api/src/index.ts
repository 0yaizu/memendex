import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createAuth } from './auth'

type Bindings = {
  DATABASE_URL: string
	CORS_ORIGIN: string
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

app.on(['GET', 'POST'], '/api/auth/**', (c) => {
  const auth = createAuth(c.env.DATABASE_URL, c.env.CORS_ORIGIN)
  return auth.handler(c.req.raw)
})

export default app