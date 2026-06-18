import { createMiddleware } from 'hono/factory'
import { createAuth } from '../auth'

type Bindings = {
  DATABASE_URL: string
	GOOGLE_CLIENT_ID: string
	GOOGLE_CLIENT_SECRET: string
}

type Variables = {
  userId: string
}

export const authMiddleware = createMiddleware<{
  Bindings: Bindings
  Variables: Variables
}>(async (c, next) => {
  const auth = createAuth(c.env)
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return c.json({ error: '認証が必要です' }, 401)
  }

  c.set('userId', session.user.id)
  await next()
})