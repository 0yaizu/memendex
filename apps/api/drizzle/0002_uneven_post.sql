CREATE TYPE "public"."visibility" AS ENUM('private', 'unlisted', 'public');--> statement-breakpoint
ALTER TABLE "memes" RENAME COLUMN "is_public" TO "visibility";