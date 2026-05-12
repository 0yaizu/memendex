CREATE TYPE "public"."visibility" AS ENUM('private', 'unlisted', 'public');--> statement-breakpoint
ALTER TABLE "memes" ALTER COLUMN "visibility" TYPE "public"."visibility" USING 
  CASE 
    WHEN "visibility" = true THEN 'public'::"public"."visibility"
    ELSE 'private'::"public"."visibility"
  END;--> statement-breakpoint
ALTER TABLE "memes" ALTER COLUMN "visibility" SET DEFAULT 'private'::"public"."visibility";