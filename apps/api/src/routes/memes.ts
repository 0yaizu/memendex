import { Hono } from 'hono'
import { createDb } from '@db/client'
import { memes } from '@db/schema'
import { authMiddleware } from '@src/middleware/auth'
import { eq } from 'drizzle-orm'
import { createAuth } from '@src/auth'

type Bindings = {
  DATABASE_URL: string
  memendex_images: R2Bucket
	ACCOUNT_ID: string
}

const memesRoute = new Hono<{ Bindings: Bindings }>()

memesRoute.get('/image/:userId/:filename', async (c) => {
	const userId = c.req.param('userId')
	const filename = c.req.param('filename')
	const key = `${userId}/${filename}`

	const object = await c.env.memendex_images.get(key)

	if (!object) {
		return c.json({ error: '画像が見つかりません'}, 401)
	}

	return new Response(object.body, {
		headers: {
			'Content-Type': object.httpMetadata?.contentType ?? 'image/jpeg',
			'Cache-Control': 'public, max-age=31536000',
		}
	})
})

memesRoute.post('/upload', authMiddleware, async (c) => {
	const formData = await c.req.formData()
	const file = formData.get('image') as File | null
	const title = formData.get('title') as string | null
	const description = formData.get('description') as string | null
	const userId = c.get('userId')

	if (!file || !title) {
		return c.json({ error: '画像・タイトルは必須です' }, 400)
	}

	// ファイルサイズチェック
	const MAX_SIZE = 10 * 1024 * 1024
	if (file.size > MAX_SIZE) {
		return c.json({ error: 'ファイルサイズは10MB以下にしてください' }, 400)
	}

	// MIMEタイプチェック
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedMimeTypes.includes(file.type)) {
    return c.json({ error: '許可されていないファイル形式です' }, 400)
  }

	// マジックバイトチェック
  const buffer = await file.arrayBuffer()
  const bytes = new Uint8Array(buffer)

  const isPng  = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47
  const isJpeg = bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF
  const isGif  = bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46
  const isWebp = bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50

  if (!isPng && !isJpeg && !isGif && !isWebp) {
    return c.json({ error: '画像ファイルではありません' }, 400)
  }

	const ext = file.name.split('.').pop()
	const key = `${userId}/${crypto.randomUUID()}.${ext}`

	await c.env.memendex_images.put(key, file.stream(), {
    httpMetadata: {
      contentType: file.type,
    },
  })

	const db = createDb(c.env.DATABASE_URL)
	const [meme] = await db.insert(memes).values({
    userId,
    imageUrl: key,
    title: title,
    description: description ?? undefined,
		visibility: 'private',
  }).returning()

	return c.json({ meme }, 201)
})

memesRoute.get('/', authMiddleware, async (c) => {
  const userId = c.get('userId')
  const db = createDb(c.env.DATABASE_URL)

  const allMemes = await db.query.memes.findMany({
    where: eq(memes.userId, userId),
    with: {
      memeTags: {
        with: {
          tag: true,
        },
      },
    },
    orderBy: (memes, { desc }) => [desc(memes.createdAt)],
  })

  return c.json({ memes: allMemes })
})

memesRoute.get('/:id', authMiddleware, async (c) => {
	const id = Number(c.req.param('id'))

	if (isNaN(id)) {
    return c.json({ error: '無効なIDです' }, 400)
  }

	const db = createDb(c.env.DATABASE_URL)

	const meme = await db.query.memes.findFirst({
    where: eq(memes.id, id),
    with: {
      memeTags: {
        with: {
          tag: true,
        },
      },
    },
  })

	if (!meme) {
    return c.json({ error: 'ミームが見つかりません' }, 404)
  }

	if (meme.visibility == 'private') {
		const auth = createAuth(c.env.DATABASE_URL)
		const session = await auth.api.getSession({ headers: c.req.raw.headers })
		if (!session || session.user.id !== meme.userId) return c.json({ error: "権限がありません。"}, 403)
	}

	return c.json({ meme })
})

export default memesRoute