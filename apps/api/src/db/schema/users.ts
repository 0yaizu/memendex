import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	created_at: timestamp("created_at").defaultNow().notNull()
})