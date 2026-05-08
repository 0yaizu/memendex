import { createMiddleware } from 'hono/factory'
import { createAuth } from '../auth'

type Bindings = {
  DATABASE_URL: string
}

type Variables = {
  userId: string
}

export const authMiddleware = createMiddleware<{
  Bindings: Bindings
  Variables: Variables
}>(async (c, next) => {
  const auth = createAuth(c.env.DATABASE_URL)
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return c.json({ error: '認証が必要です' }, 401)
  }

  c.set('userId', session.user.id)
  await next()
})