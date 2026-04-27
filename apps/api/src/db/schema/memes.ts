import { pgTable, serial, text, boolean, timestamp, integer, primaryKey } from "drizzle-orm/pg-core";
import { users } from './users'
import { tags } from "./tags";

export const memes = pgTable('memes', {
  id:          serial('id').primaryKey(),
  userId:      text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  imageUrl:    text('image_url').notNull(),
	title: 		   text('title').notNull(),
  description: text('description'),
  isPublic:    boolean('is_public').default(false).notNull(),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
  updatedAt:   timestamp('updated_at').defaultNow().notNull(),
})

export const memeTags = pgTable('meme_tags', {
  memeId: integer('meme_id').notNull().references(() => memes.id, { onDelete: 'cascade' }),
  tagId:  integer('tag_id').notNull().references(() => tags.id,  { onDelete: 'cascade' }),
}, (t) => [
	primaryKey({ columns: [t.memeId, t.tagId] }),
])