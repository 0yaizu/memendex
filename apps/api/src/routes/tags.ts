import { Hono } from 'hono'
import { createDb } from '../db/client'
import { tags, memeTags, memes } from '../db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { authMiddleware } from '../middleware/auth'

type Bindings = {
  DATABASE_URL: string
}

const tagsRoute = new Hono<{ Bindings: Bindings }>()

// タグを追加
tagsRoute.post('/memes/:memeId/tags', authMiddleware, async (c) => {
  const memeId = Number(c.req.param('memeId'))
  const { name } = await c.req.json()

  if (isNaN(memeId) || !name) {
    return c.json({ error: 'memeIdとタグ名は必須です' }, 400)
  }

	const userId = c.get('userId')
  const db = createDb(c.env.DATABASE_URL)

	const [meme] = await db
		.select()
		.from(memes)
		.where(and(eq(memes.id, memeId), eq(memes.userId, userId)))

	if (!meme) {
    return c.json({ error: '403 Forbidden' }, 403)
  }

  // タグが存在しなければ作成、あればそのIDを使う
  const [tag] = await db
    .insert(tags)
    .values({ name })
    .onConflictDoUpdate({ target: tags.name, set: { name } })
    .returning()

	if (!tag) {
		return c.json({ error: 'タグの作成、または取得に失敗しました'}, 500)
	}

  // 中間テーブルに追加
  await db
    .insert(memeTags)
    .values({ memeId, tagId: tag.id })
    .onConflictDoNothing()

  return c.json({ tag }, 201)
})

// タグを削除
tagsRoute.delete('/memes/:memeId/tags/:tagId', authMiddleware, async (c) => {
  const memeId = Number(c.req.param('memeId'))
  const tagId = Number(c.req.param('tagId'))

  if (isNaN(memeId) || isNaN(tagId)) {
    return c.json({ error: '無効なIDです' }, 400)
  }
	const userId = c.get('userId')
  const db = createDb(c.env.DATABASE_URL)

	const [meme] = await db
		.select()
		.from(memes)
		.where(and(eq(memes.id, memeId), eq(memes.userId, userId)))

	if (!meme) {
    return c.json({ error: '403 Forbidden' }, 403)
  }

  await db
    .delete(memeTags)
    .where(and(eq(memeTags.memeId, memeId), eq(memeTags.tagId, tagId)))

  return c.json({ ok: true })
})

// タグを検索
tagsRoute.get('/tags/search', authMiddleware, async (c) => {
  const q = c.req.query('q') ?? ''
  const db = createDb(c.env.DATABASE_URL)

  const result = await db
    .select({
      id: tags.id,
      name: tags.name,
      count: sql<number>`COUNT(${memeTags.tagId})`.as('count'),
    })
    .from(tags)
    .leftJoin(memeTags, eq(tags.id, memeTags.tagId))
    .where(sql`${tags.name} LIKE ${`${q}%`}`)
    .groupBy(tags.id)
    .orderBy(sql`COUNT(${memeTags.tagId}) DESC`)
    .limit(5)

  return c.json({ tags: result })
})

export default tagsRoute