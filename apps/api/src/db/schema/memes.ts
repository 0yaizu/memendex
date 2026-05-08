import { pgTable, serial, text, boolean, timestamp, integer, primaryKey } from "drizzle-orm/pg-core";
import { user } from './auth'
import { tags } from "./tags";
import { relations } from "drizzle-orm";

export const memes = pgTable('memes', {
  id:          serial('id').primaryKey(),
  userId:      text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
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

export const memesRelations = relations(memes, ({ many }) => ({
  memeTags: many(memeTags),
}))

export const memeTagsRelations = relations(memeTags, ({ one }) => ({
  meme: one(memes, {
    fields: [memeTags.memeId],
    references: [memes.id],
  }),
  tag: one(tags, {
    fields: [memeTags.tagId],
    references: [tags.id],
  }),
}))